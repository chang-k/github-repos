# GitHub Repository Search App

FigmaデザインをベースにしたGitHubリポジトリ検索アプリケーション。**Feature-Sliced Design (FSD)** アーキテクチャを採用し、スケーラブルで保守性の高い構造を実現しています。

## 目次

1. [アーキテクチャ](#アーキテクチャ)
2. [技術スタック](#技術スタック)
3. [プロジェクト構造](#プロジェクト構造)
4. [セットアップ](#セットアップ)
5. [使用方法](#使用方法)

---

## アーキテクチャ

### Feature-Sliced Design (FSD) を採用した理由

本プロジェクトでは、当初 **Atomic Design** で実装していましたが、以下の課題が顕在化しました：

#### ❌ Atomic Design の課題

1. **ビジネスロジックとUIの分離が困難**
   ```typescript
   // components/molecules/SearchFilters.tsx
   <Input {...register("minStars")} />  // react-hook-formに直接依存
   ```
   - Molecule層がフォームライブラリに依存
   - ドメイン知識（「最小Star数」）がハードコーディング
   - 再利用性が低い

2. **責務の曖昧さ**
   - Atoms, Molecules, Organismsの境界が不明瞭
   - どのレイヤーにビジネスロジックを置くべきか判断が難しい
   - コンポーネントが肥大化しやすい

3. **スケーラビリティの欠如**
   - 機能追加時に既存コードへの影響が大きい
   - チーム開発で衝突が発生しやすい
   - テストが困難

#### ✅ Feature-Sliced Design のメリット

1. **明確な責務分離**
   ```
   app/         # ルーティングのみ
   widgets/     # ページブロック（複数機能の統合）
   features/    # ユーザーアクション（ビジネスロジック）
   entities/    # データ表示（受動的）
   shared/      # 汎用インフラ（完全抽象化）
   ```

2. **低い結合度**
   - 各レイヤーが独立
   - ライブラリ依存を適切なレイヤーに隠蔽
   - 外部からは公開APIのみアクセス可能

3. **高いスケーラビリティ**
   - 機能単位で並行開発可能
   - 新機能追加時に既存コードを触らない
   - マイクロフロントエンドへの移行も容易

4. **テスタビリティ**
   - 各レイヤーが独立してテスト可能
   - モック・スタブが容易
   - ビジネスロジックの単体テストが書きやすい

---

### FSD レイヤー構造と運用ガイドライン

```
src/
├── app/                    # Next.js App Router（ルーティング）
├── widgets/                # ページブロック層
├── features/               # ユーザーアクション層
├── entities/               # ビジネスエンティティ層
└── shared/                 # 共通インフラ層
```

---

## 各レイヤーの詳細説明と運用方法

### 1. **app/ レイヤー** - アプリケーション層

#### 役割
Next.js App Routerのルーティング定義のみを担当。ビジネスロジックは一切含めない。

#### 責務
✅ **やるべきこと:**
- ルーティング定義（ファイルベース）
- レイアウト定義（`layout.tsx`）
- グローバルProviderの設定（TanStack Query、認証など）
- Widgetの組み立て（単純なimportとレンダリング）
- Server Component / Client Componentの選択
- メタデータ設定（SEO）

❌ **やってはいけないこと:**
- ビジネスロジックの実装
- データフェッチロジック（APIクエリ構築など）
- 状態管理（useState、useReducerなど）
- 外部ライブラリの直接使用（react-hook-formなど）

#### 実装例

```typescript
// ✅ OK: シンプルなWidget組み立て
// app/page.tsx
import { RepositorySearchPage } from '@/widgets/repository-search-page';

export default function Home() {
  return <RepositorySearchPage />;
}

// ✅ OK: Server Componentでのデータフェッチ
// app/detail/[owner]/[repo]/page.tsx
import { getRepository } from '@/entities/repository';
import { RepositoryDetailPage } from '@/widgets/repository-detail-page';

export default async function DetailPage({ params }: { params: Promise<{ owner: string; repo: string }> }) {
  const { owner, repo } = await params;
  const repository = await getRepository(owner, repo);
  return <RepositoryDetailPage repository={repository} />;
}

// ❌ NG: App層でビジネスロジック
// app/page.tsx
export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");  // ❌ 状態管理はWidget層へ
  const { register } = useForm();  // ❌ フォームロジックはFeature層へ
  // ...
}
```

#### 使い分けの判断基準

**Server Componentを使う場合:**
- SEOが重要（詳細ページ、ブログなど）
- 初期表示を高速化したい
- サーバー側でのみ動作する処理（データベース直接アクセスなど）

**Client Componentを使う場合:**
- インタラクティブな操作が必要（検索、フィルタリング）
- ブラウザAPIを使用（localStorage、位置情報など）
- 状態管理が必要

---

### 2. **widgets/ レイヤー** - ページブロック層

#### 役割
ページ単位の大きな独立したブロックを構成。複数のFeatureやEntityを組み合わせて1つの完結した機能ブロックを作る。

#### 責務
✅ **やるべきこと:**
- 複数のFeature/Entityの統合
- ページレベルの状態管理（検索クエリ、フィルター条件など）
- レイアウト構成（ヘッダー、フッター、サイドバーなど）
- Feature間のデータ受け渡し（コールバック関数）
- TanStack Queryのデータフェッチ（useInfiniteQuery、useQuery）
- ローディング状態、エラー状態の管理

❌ **やってはいけないこと:**
- フォームライブラリの直接使用（`useForm`など）
- バリデーションロジック
- API呼び出しロジックの詳細（クエリ構築など）
- ドメイン固有のビジネスルール

#### 実装例

```typescript
// ✅ OK: 複数Featureの統合とページレベル状態管理
// widgets/repository-search-page/ui/RepositorySearchPage.tsx
import { SearchForm } from '@/features/search-repositories';
import { RepositoryList } from '@/widgets/repository-list';
import { useSearchPage } from '../model/useSearchPage';

export const RepositorySearchPage: React.FC = () => {
  const { searchQuery, filters, handleSearch } = useSearchPage();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <Heading level={1} className="mb-6">リポジトリ検索</Heading>
          <SearchForm onSearch={handleSearch} />
        </div>
        <RepositoryList searchQuery={searchQuery} filters={filters} />
      </div>
    </div>
  );
};

// widgets/repository-search-page/model/useSearchPage.ts
export const useSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filters, setFilters] = useState<SearchFormData | null>(null);

  const handleSearch = (query: string, formData: SearchFormData) => {
    setSearchQuery(query);
    setFilters(formData);
  };

  return { searchQuery, filters, handleSearch };
};

// ✅ OK: TanStack Queryでのデータフェッチ
// widgets/repository-list/model/useInfiniteRepositories.ts
export const useInfiniteRepositories = (searchQuery: string) => {
  return useInfiniteQuery({
    queryKey: ['repositories', searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      return searchRepositories({ q: searchQuery, per_page: 10, page: pageParam });
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce((acc, page) => acc + page.items.length, 0);
      return totalFetched < lastPage.total_count ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

// ❌ NG: Widgetでフォームライブラリ直接使用
// widgets/repository-search-page/ui/RepositorySearchPage.tsx
export const RepositorySearchPage = () => {
  const { register, handleSubmit } = useForm();  // ❌ Feature層の責務
  const onSubmit = (data) => { /* ... */ };  // ❌ ビジネスロジック
  return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
};
```

#### 使い分けの判断基準

**Widgetを作る場合:**
- ページ全体または大きなセクション（検索ページ、ダッシュボード）
- 複数のFeatureを組み合わせる必要がある
- ページ固有の状態管理が必要

**Widgetを作らない場合:**
- 単一のFeatureのみで構成される場合はApp層で直接Featureを使う

---

### 3. **features/ レイヤー** - ビジネスロジック層

#### 役割
ユーザーの具体的なアクション（検索、フィルタリング、登録など）を実現する。ビジネスロジックとフォームロジックを管理。

#### 責務
✅ **やるべきこと:**
- フォームライブラリの使用（React Hook Form、Formikなど）
- バリデーションロジック（Zodスキーマ）
- APIクエリ構築（GitHub検索クエリ文字列など）
- クライアント側フィルタリングロジック
- ドメイン固有のビジネスルール
- Feature固有のUI（検索フォーム、フィルターパネル）
- Entityの型を使用（Repository、Userなど）

❌ **やってはいけないこと:**
- データフェッチの実行（TanStack Queryの直接使用）
- ページレベルの状態管理
- 他のFeatureへの依存
- 汎用UIコンポーネントの定義（Shared層へ）

#### 実装例

```typescript
// ✅ OK: フォームロジックの管理
// features/search-repositories/model/useSearchForm.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { searchSchema } from './searchSchema';

export const useSearchForm = () => {
  const { register, handleSubmit, formState } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      keyword: "",
      star: { min: null, max: null },
      watcher: { min: null, max: null },
      fork: { min: null, max: null },
      issue: { min: null, max: null },
    },
  });

  return {
    register,
    handleSubmit,
    errors: formState.errors,
  };
};

// ✅ OK: ビジネスロジック（GitHub APIクエリ構築）
// features/search-repositories/model/buildSearchQuery.ts
export function buildSearchQuery(data: SearchFormData): string {
  const parts = [data.keyword];

  // GitHub APIがサポートする条件のみ追加
  if (data.star.min !== null && !isNaN(Number(data.star.min))) {
    parts.push(`stars:>=${data.star.min}`);
  }
  if (data.star.max !== null && !isNaN(Number(data.star.max))) {
    parts.push(`stars:<=${data.star.max}`);
  }

  return parts.filter(Boolean).join(" ");
}

// ✅ OK: クライアント側フィルタリング（ビジネスルール）
// features/search-repositories/model/filterRepositories.ts
import { Repository } from '@/entities/repository';

export function filterRepositories(
  repositories: Repository[],
  filters: SearchFormData
): Repository[] {
  return repositories.filter((repo) => {
    // Watcher数フィルター
    if (filters.watcher.min && repo.watchers_count < filters.watcher.min) return false;
    if (filters.watcher.max && repo.watchers_count > filters.watcher.max) return false;

    // Issue数フィルター
    if (filters.issue.min && repo.open_issues_count < filters.issue.min) return false;
    if (filters.issue.max && repo.open_issues_count > filters.issue.max) return false;

    return true;
  });
}

// ✅ OK: Feature固有のUI
// features/search-repositories/ui/SearchForm.tsx
export const SearchForm: React.FC<{ onSearch: (query: string, data: SearchFormData) => void }> = ({ onSearch }) => {
  const { register, handleSubmit, errors } = useSearchForm();

  const onSubmit = (data: SearchFormData) => {
    const query = buildSearchQuery(data);
    onSearch(query, data);  // 上位層にコールバック
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SearchInput register={register} error={errors.keyword} />
      <FilterAccordion>
        <NumberRangeInput label="Star数" fieldName="star" register={register} />
      </FilterAccordion>
    </form>
  );
};

// ❌ NG: Featureでデータフェッチ実行
// features/search-repositories/model/useSearch.ts
export const useSearch = () => {
  const { data } = useInfiniteQuery({ /* ... */ });  // ❌ Widget層の責務
  // ...
};

// ❌ NG: 他のFeatureへの依存
// features/search-repositories/model/useSearch.ts
import { BookmarkButton } from '@/features/bookmark-repository';  // ❌ 禁止
```

#### 使い分けの判断基準

**新しいFeatureを作る場合:**
- ユーザーの明確なアクション（検索、ログイン、ブックマークなど）
- フォーム入力とバリデーションが必要
- ビジネスルールの実装が必要

**Featureに含めるべきもの:**
- `/ui` - Feature固有のUI（フォーム、ボタン、パネルなど）
- `/model` - ロジック（バリデーション、データ変換、フィルタリング）
- `/api` - API呼び出し関数（実行はWidget層）
- `index.ts` - Public API

---

### 4. **entities/ レイヤー** - データ表現層

#### 役割
ビジネスデータ（Repository、User、Productなど）の表現と表示のみを担当。アクティブな操作は一切持たない。

#### 責務
✅ **やるべきこと:**
- ビジネスエンティティの型定義（TypeScript interface）
- データ表示用のUIコンポーネント（カード、リストアイテム）
- データフォーマッター（日付、数値、通貨など）
- API取得関数（`getRepository`、`getUser`など）
- Shared UIの使用（Button、Text、Iconなど）

❌ **やってはいけないこと:**
- ユーザーアクションの処理（ボタンクリック、フォーム送信など）
- 状態管理（useState、useContext）
- 外部データフェッチ（TanStack Query）
- ビジネスロジック（バリデーション、計算など）

#### 実装例

```typescript
// ✅ OK: 型定義
// entities/repository/model/types.ts
export interface Repository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  html_url: string;
}

// ✅ OK: データフォーマッター
// entities/repository/model/formatters.ts
export const formatCount = (count: number): string => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
};

// ✅ OK: データ表示用UI（受動的）
// entities/repository/ui/RepositoryCard.tsx
import { Repository } from '../model/types';
import { Text } from '@/shared/ui/Text';
import { Icon } from '@/shared/ui/Icon';

export const RepositoryCard: React.FC<{ repository: Repository }> = ({ repository }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start gap-4">
        <img src={repository.owner.avatar_url} alt={repository.owner.login} className="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <Text size="lg" weight="bold">{repository.full_name}</Text>
          <Text size="sm" color="gray">{repository.description}</Text>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1">
              <Icon name="star" />
              <Text size="sm">{formatCount(repository.stargazers_count)}</Text>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="fork" />
              <Text size="sm">{formatCount(repository.forks_count)}</Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ OK: API取得関数
// entities/repository/api/getRepository.ts
import { githubClient } from '@/shared/api/github-client';
import { Repository } from '../model/types';

export async function getRepository(owner: string, repo: string): Promise<Repository> {
  return githubClient<Repository>(`/repos/${owner}/${repo}`);
}

// ❌ NG: Entityでアクション処理
// entities/repository/ui/RepositoryCard.tsx
export const RepositoryCard = ({ repository }) => {
  const handleClick = () => {  // ❌ アクションはFeature層へ
    // ...
  };
  return <div onClick={handleClick}>...</div>;
};

// ❌ NG: Entityで状態管理
// entities/repository/ui/RepositoryCard.tsx
export const RepositoryCard = ({ repository }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);  // ❌ 状態はWidget/Feature層へ
  // ...
};
```

#### 使い分けの判断基準

**新しいEntityを作る場合:**
- データベースのテーブルに対応する概念（Repository、User、Product）
- 複数のFeatureで共有されるデータ構造
- 表示のみで操作は不要

**Entityに含めるべきもの:**
- `/model/types.ts` - 型定義
- `/model/formatters.ts` - データフォーマッター
- `/ui` - データ表示用コンポーネント（受動的）
- `/api` - データ取得関数
- `index.ts` - Public API

---

### 5. **shared/ レイヤー** - 共通インフラ層

#### 役割
プロジェクト全体、さらには他プロジェクトでも再利用可能な完全に抽象化された要素のみを配置。

#### 責務
✅ **やるべきこと:**
- 汎用UIコンポーネント（Button、Input、Modal、Tooltipなど）
- ユーティリティ関数（日付操作、文字列操作など）
- API基盤（fetchラッパー、エラーハンドリング）
- グローバルProvider（TanStack Query、認証など）
- デザインシステムの実装
- 型ユーティリティ（Omit、Pick、Partialなど）

❌ **やってはいけないこと:**
- ビジネスロジックへの依存
- 上位レイヤーのimport（entities、features、widgets、app）
- ドメイン固有の実装（Repository、Userなど）
- 状態管理（グローバルProviderを除く）

#### 実装例

```typescript
// ✅ OK: 完全に抽象化されたUIコンポーネント
// shared/ui/Button/Button.tsx
export interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  type = 'button',
}) => {
  const baseClasses = 'rounded-md font-medium transition-colors';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  };
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// ✅ OK: forwardRefでReact Hook Form対応
// shared/ui/Input/Input.tsx
import { forwardRef } from 'react';

export interface InputProps {
  label?: string;
  error?: string;
  type?: string;
  placeholder?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, type = 'text', placeholder, ...rest }, ref) => {
    return (
      <div>
        {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...rest}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

// ✅ OK: API基盤
// shared/api/github-client.ts
const GITHUB_API_BASE_URL = 'https://api.github.com';

export async function githubClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${GITHUB_API_BASE_URL}${endpoint}`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
}

// ✅ OK: グローバルProvider
// shared/lib/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 60秒
    },
  },
});

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

// ❌ NG: Sharedでビジネスロジック
// shared/ui/RepositoryButton/RepositoryButton.tsx
import { Repository } from '@/entities/repository';  // ❌ 上位レイヤーへの依存

export const RepositoryButton = ({ repository }: { repository: Repository }) => {
  // ❌ ドメイン固有の実装
};
```

#### 使い分けの判断基準

**Sharedに配置する場合:**
- 他プロジェクトでも使える汎用性
- ビジネスロジックへの依存がゼロ
- デザインシステムの一部

**Sharedに配置しない場合:**
- ドメイン固有の実装（→ entities/features）
- プロジェクト固有のロジック（→ features）

---

## レイヤー選択のフローチャート

実装時に「どのレイヤーに置くべきか」を判断するフローチャート：

```
新しいコードを書く
  ↓
┌─────────────────────────────────────────┐
│ これはルーティングに関するコード？       │ → YES → app/
└─────────────────────────────────────────┘
  ↓ NO
┌─────────────────────────────────────────┐
│ 他プロジェクトでも使える汎用コード？     │ → YES → shared/
└─────────────────────────────────────────┘
  ↓ NO
┌─────────────────────────────────────────┐
│ データの表示のみ？（アクションなし）     │ → YES → entities/
└─────────────────────────────────────────┘
  ↓ NO
┌─────────────────────────────────────────┐
│ ユーザーアクション（検索、登録など）？   │ → YES → features/
└─────────────────────────────────────────┘
  ↓ NO
┌─────────────────────────────────────────┐
│ 複数のFeature/Entityを統合？             │ → YES → widgets/
└─────────────────────────────────────────┘
```

---

## よくある質問（FAQ）

### Q1: Widgetでフォームロジック（useForm）を使ってはいけない理由は？

**A:** FSDの原則「下位レイヤーほど抽象的、上位レイヤーほど具体的」に反するためです。

```typescript
// ❌ NG: Widgetでフォーム直接管理（3/10点）
// widgets/repository-search-page/ui/RepositorySearchPage.tsx
export const RepositorySearchPage = () => {
  const { register, handleSubmit } = useForm();  // ❌ react-hook-formへの直接依存
  // Widget層にバリデーションロジックが混入
  // テストが困難
  // Feature層の責務を侵害
};

// ✅ OK: Feature層でカプセル化（8/10点）
// features/search-repositories/ui/SearchForm.tsx
export const SearchForm = ({ onSearch }) => {
  const { register, handleSubmit } = useSearchForm();  // ✅ Feature内部に隠蔽
  return <form onSubmit={handleSubmit((data) => onSearch(data))}>...</form>;
};

// widgets/repository-search-page/ui/RepositorySearchPage.tsx
export const RepositorySearchPage = () => {
  const handleSearch = (data) => { /* ... */ };
  return <SearchForm onSearch={handleSearch} />;  // ✅ Featureを使うのみ
};
```

**理由:**
1. **責務の分離**: フォームロジックはFeature層の責務
2. **再利用性**: SearchFormは他のWidgetでも使える
3. **テスト容易性**: Feature単体でテスト可能
4. **ライブラリ変更の影響範囲**: react-hook-form → Formikへの変更時、Feature層のみ修正

### Q2: EntityとFeatureの違いは？

**A:** **受動的（Entity）** vs **能動的（Feature）**

| 観点 | Entity | Feature |
|------|--------|---------|
| **アクション** | なし（データ表示のみ） | あり（検索、登録など） |
| **状態管理** | 不可 | 可（フォーム状態など） |
| **例** | RepositoryCard（表示） | SearchForm（検索実行） |
| **Props** | データのみ受け取る | コールバック関数を受け取る |

```typescript
// Entity: 受動的
<RepositoryCard repository={repo} />  // データを渡すのみ

// Feature: 能動的
<SearchForm onSearch={(query) => { /* ... */ }} />  // アクション実行
```

### Q3: 同一レイヤー内で他のモジュールをimportできる？

**A:** **基本的にNO**。FSDでは同一レイヤー内でも相互依存を避けます。

```typescript
// ❌ NG: 同一レイヤーの相互依存
// features/search-repositories/model/useSearch.ts
import { FilterPanel } from '@/features/filter-repositories';  // ❌ 禁止

// ✅ OK: Widget層で統合
// widgets/repository-search-page/ui/RepositorySearchPage.tsx
import { SearchForm } from '@/features/search-repositories';
import { FilterPanel } from '@/features/filter-repositories';

export const RepositorySearchPage = () => {
  return (
    <div>
      <SearchForm />
      <FilterPanel />
    </div>
  );
};
```

### Q4: データフェッチはどこで行う？

**A:** **Widget層のmodel/** で行います。

```typescript
// ✅ OK: Widget層でTanStack Query使用
// widgets/repository-list/model/useInfiniteRepositories.ts
export const useInfiniteRepositories = (searchQuery: string) => {
  return useInfiniteQuery({
    queryKey: ['repositories', searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      return searchRepositories({ q: searchQuery, per_page: 10, page: pageParam });
    },
    // ...
  });
};

// ❌ NG: Feature層でデータフェッチ実行
// features/search-repositories/model/useSearch.ts
export const useSearch = () => {
  const { data } = useInfiniteQuery({ /* ... */ });  // ❌ Widget層の責務
};
```

**理由:**
- データフェッチは「複数Featureの結果を統合」するWidget層の責務
- API呼び出し関数の定義はFeature/Entity層で行い、実行はWidget層で行う

---

### Q5: Widget層でuseState（ページレベル状態管理）は許可される？

**A:** **✅ YES - 9/10点** Widget層の正当な責務です。

#### 許可される理由

**1. Widget層のページレベル状態管理は正当な責務**

```typescript
// ✅ OK: Widget層でページローカル状態を管理（9/10点）
// widgets/repository-search-page/model/useSearchPage.ts
export const useSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filters, setFilters] = useState<SearchFormData | null>(null);

  const handleSearch = (query: string, formData: SearchFormData) => {
    setSearchQuery(query);
    setFilters(formData);
  };

  return { searchQuery, filters, handleSearch };
};

// widgets/repository-search-page/ui/RepositorySearchPage.tsx
export const RepositorySearchPage = () => {
  const { searchQuery, filters, handleSearch } = useSearchPage();

  return (
    <div>
      <SearchForm onSearch={handleSearch} />
      <RepositoryList searchQuery={searchQuery} filters={filters} />
    </div>
  );
};
```

**2. 複数Featureを統合する役割として適切**

この状態は以下の役割を果たします：
- `SearchForm`（Feature層）からの検索条件を受け取る
- `RepositoryList`（Widget層）に検索条件を渡す
- **Feature間の橋渡し役** = Widget層の責務

```
SearchForm (Feature)
  ↓ onSearch(query, formData)
useSearchPage (Widget) ← ページレベル状態管理
  ↓ searchQuery, filters
RepositoryList (Widget)
```

#### ❌ NGな状態管理の例

```typescript
// ❌ NG: アプリ全体の状態をWidgetで管理（App層の責務）
export const useSearchPage = () => {
  const [currentUser, setCurrentUser] = useState(null);  // ❌ App層へ
  const [globalTheme, setGlobalTheme] = useState("dark");  // ❌ App層へ
};

// ❌ NG: ビジネスロジックをWidgetで管理（Feature層の責務）
export const useSearchPage = () => {
  const { register, handleSubmit } = useForm();  // ❌ Feature層へ
  const validateQuery = (query) => { /* ... */ };  // ❌ Feature層へ
};

// ❌ NG: フォーム状態をWidgetで管理（Feature層の責務）
export const useSearchPage = () => {
  const [keyword, setKeyword] = useState("");  // ❌ Feature層へ
  const [minStars, setMinStars] = useState(0);  // ❌ Feature層へ
};
```

#### 状態管理の配置ルール

| 状態の種類 | 配置レイヤー | 例 | 評価 |
|-----------|-------------|-----|------|
| **ページローカル状態** | Widget層 | searchQuery, filters | ✅ 9/10 |
| **フォーム状態** | Feature層 | keyword, star.min, star.max | ✅ 10/10 |
| **アプリ全体の状態** | App層 | currentUser, authToken | ✅ 8/10 |
| **Feature間共有状態** | Jotai/Zustand | searchHistory, bookmarks | ✅ 9/10 |

#### Jotai/Zustandを使うべきケース

**現在のページローカル状態:**
- ❌ **Jotai不要**（2/10点） - 過剰設計
- ✅ **useState推奨**（9/10点） - シンプルで十分

**将来の機能追加時にJotaiを検討:**
```typescript
// ✅ OK: 複数ページで共有する状態
// features/search-repositories/model/searchHistoryAtoms.ts
import { atomWithStorage } from 'jotai/utils';

export const searchHistoryAtom = atomWithStorage<string[]>('searchHistory', []);

// ✅ OK: ブックマーク機能（複数ページで共有）
// features/bookmark-repository/model/bookmarkAtoms.ts
export const bookmarkedReposAtom = atomWithStorage<number[]>('bookmarks', []);

// ✅ OK: 認証状態（アプリ全体で共有）
// shared/state/authAtoms.ts
export const currentUserAtom = atom<User | null>(null);
```

#### まとめ

**Widget層での状態管理が許可されるケース:**
- ✅ ページローカル状態（現在のページのみで使用）
- ✅ 複数Featureの統合に必要な状態
- ✅ Feature間のデータ受け渡し

**Widget層で禁止される状態管理:**
- ❌ フォーム状態（Feature層へ）
- ❌ ビジネスロジック（Feature層へ）
- ❌ アプリ全体の状態（App層またはJotai/Zustandへ）

---

## アーキテクチャ評価基準

実装が正しいかを評価する基準：

### ✅ 良い実装（8-10点）

- [ ] 各レイヤーの責務が明確に分離されている
- [ ] 依存方向が一方向（下位レイヤーのみに依存）
- [ ] Public APIパターンが適用されている（index.ts）
- [ ] ビジネスロジックがFeature層に集中している
- [ ] Shared層が完全に抽象化されている
- [ ] テストが容易（各レイヤー独立してテスト可能）

### ⚠️ 改善の余地（5-7点）

- [ ] 一部のレイヤーで責務が混在している
- [ ] Props Drillingが深い（3階層以上）
- [ ] 同一レイヤー内で相互依存がある
- [ ] ビジネスロジックがWidget層に漏れている

### ❌ 要リファクタリング（1-4点）

- [ ] 上位レイヤーへの依存がある（逆方向依存）
- [ ] Shared層がビジネスロジックに依存している
- [ ] Widget層でフォームロジック（useForm）を直接使用
- [ ] Entity層でアクション処理がある
- [ ] App層にビジネスロジックがある

---

### 依存関係のルール

FSDの最も重要な原則は**単方向の依存関係**です。

#### ✅ 許可される依存方向

```
app → widgets → features/entities → shared
```

各レイヤーは**下層のみ**に依存できます：

```typescript
// ✅ OK: widgetがfeatureを使用
// widgets/repository-search-page/ui/RepositorySearchPage.tsx
import { SearchForm } from '@/features/search-repositories';

// ✅ OK: featureがentityの型を使用
// features/search-repositories/model/filterRepositories.ts
import { Repository } from '@/entities/repository';

// ✅ OK: entityがsharedのUIを使用
// entities/repository/ui/RepositoryCard.tsx
import { Text } from '@/shared/ui/Text';
```

#### ❌ 禁止される依存方向

```typescript
// ❌ NG: sharedが上位レイヤーを参照
// shared/ui/Button/Button.tsx
import { SearchFormData } from '@/features/search-repositories';  // 禁止！

// ❌ NG: entityがfeatureを参照
// entities/repository/ui/RepositoryCard.tsx
import { useSearch } from '@/features/search-repositories';  // 禁止！

// ❌ NG: featureが同一レイヤーの別featureを参照
// features/search-repositories/model/useSearch.ts
import { FilterPanel } from '@/features/filter-repositories';  // 禁止！
```

#### 📦 Public API パターン

各レイヤーは `index.ts` で公開APIを制限します：

```typescript
// features/search-repositories/index.ts
export { SearchForm } from './ui/SearchForm';           // ✅ 公開
export { useSearchForm } from './model/useSearchForm';  // ✅ 公開
// 内部実装は非公開
```

これにより：
- **カプセル化**: 内部実装の詳細を隠蔽
- **変更容易性**: 内部を変更してもPublic APIが変わらなければ影響なし
- **明確なインターフェース**: 何が使えるか一目瞭然

---

### 実装例：検索機能の責務分離

#### Before (Atomic Design)

```typescript
// components/molecules/SearchFilters.tsx
// ❌ Moleculeがreact-hook-formに依存
// ❌ ドメイン知識のハードコーディング
export const SearchFilters = ({ register }) => (
  <Input label="最小Star数" {...register("minStars")} />
);
```

#### After (FSD)

```typescript
// shared/ui/Input/Input.tsx
// ✅ 完全に抽象化、ライブラリ依存なし
export const Input = ({ value, onChange, label }) => (
  <input value={value} onChange={onChange} />
);

// features/search-repositories/ui/NumberRangeInput.tsx
// ✅ ドメイン知識はFeature層に
export const NumberRangeInput = ({ label, fieldName, register }) => (
  <Input label={`最小${label}`} {...register(`${fieldName}.min`)} />
);

// features/search-repositories/model/useSearchForm.ts
// ✅ react-hook-formはFeature内部に隠蔽
export const useSearchForm = () => {
  const { register } = useForm({ resolver: zodResolver(searchSchema) });
  return { register };
};
```

**結果:**
- `shared/ui/Input` は他プロジェクトでも再利用可能
- react-hook-formへの依存はFeature層に限定
- ライブラリ変更時の影響範囲が明確

---

### レイヤー間通信のベストプラクティス

#### 1. Props Drilling の回避

```typescript
// ❌ NG: 深いProps Drilling
<Widget>
  <Feature onSubmit={handleSubmit}>
    <Form register={register}>  // 深すぎる
```

```typescript
// ✅ OK: Feature内でロジックを完結
// features/search-repositories/ui/SearchForm.tsx
export const SearchForm = ({ onSearch }) => {
  const { register, handleSubmit } = useSearchForm();  // 内部で管理
  // ...
};
```

#### 2. コールバック関数での通信

```typescript
// ✅ OK: 上位レイヤーにコールバックで通知
// features/search-repositories/ui/SearchForm.tsx
<form onSubmit={handleSubmit((data) => onSearch(query, data))}>

// widgets/repository-search-page/ui/RepositorySearchPage.tsx
<SearchForm onSearch={(query, data) => {
  setSearchQuery(query);
  setFilters(data);
}} />
```

#### 3. 状態管理の配置

```typescript
// ✅ OK: Widget層で状態管理
// widgets/repository-search-page/model/useSearchPage.ts
const [searchQuery, setSearchQuery] = useState("");
const [filters, setFilters] = useState(null);

// ❌ NG: Feature層で広域状態管理（Contextなど）
// 複数Featureにまたがる状態はWidget/App層で管理
```

---

## 技術スタック

### フレームワーク・ライブラリ

| 技術 | バージョン | 使用箇所 | 役割 |
|------|-----------|---------|------|
| **Next.js** | 15.1.0 | `app/` | App Router、SSR/ISR |
| **React** | 19.0.0 | 全体 | UIライブラリ |
| **TypeScript** | 5.7.2 | 全体 | 型安全性 |
| **Tailwind CSS** | 3.4.17 | 全体 | スタイリング |
| **TanStack Query** | 5.62.11 | `widgets/`, `features/` | データフェッチ、無限スクロール |
| **React Hook Form** | 7.54.2 | `features/search-repositories` | フォーム管理 |
| **Zod** | latest | `features/search-repositories` | スキーマバリデーション |
| **react-intersection-observer** | 9.14.0 | `widgets/repository-list` | 無限スクロール検知 |

---

### 各技術の使われ方

#### 1. **Next.js App Router**

**使用場所:** `app/`

**役割:**
- ファイルベースルーティング
- Server/Client Componentの使い分け
- ISR（Incremental Static Regeneration）

**実装例:**
```typescript
// app/page.tsx - Client Component（検索・フィルター）
import { RepositorySearchPage } from '@/widgets/repository-search-page';
export default function Home() {
  return <RepositorySearchPage />;
}

// app/detail/[owner]/[repo]/page.tsx - Server Component（SSR）
export default async function DetailPage({ params }) {
  const repository = await getRepository(owner, repo);  // SSR
  return <RepositoryDetailPage repository={repository} />;
}
```

**設計判断:**
- **検索ページ**: Client Component（インタラクティブ）
- **詳細ページ**: Server Component（SEO、初期表示高速化）

---

#### 2. **TanStack Query**

**使用場所:** `widgets/repository-list/model/useInfiniteRepositories.ts`

**役割:**
- サーバー状態管理
- 無限スクロール（`useInfiniteQuery`）
- キャッシュ管理

**実装例:**
```typescript
export const useInfiniteRepositories = (searchQuery: string) => {
  return useInfiniteQuery({
    queryKey: ['repositories', searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      return searchRepositories({
        q: searchQuery,
        per_page: 10,
        page: pageParam,
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce((acc, page) => acc + page.items.length, 0);
      return totalFetched < lastPage.total_count ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });
};
```

**特徴:**
- 10件ずつページネーション
- 自動キャッシュ（60秒）
- `queryKey`で検索条件ごとにキャッシュ分離

---

#### 3. **React Hook Form + Zod**

**使用場所:** `features/search-repositories/model/`

**役割:**
- フォーム状態管理
- バリデーション
- パフォーマンス最適化（非制御コンポーネント）

**実装例:**
```typescript
// searchSchema.ts - Zodスキーマ
const rangeSchema = z.object({
  min: z.coerce.number().nullable().optional(),
  max: z.coerce.number().nullable().optional(),
});

export const searchSchema = z.object({
  keyword: z.string().min(1, "キーワードを入力してください"),
  star: rangeSchema,
  fork: rangeSchema,
  // ...
});

// useSearchForm.ts - React Hook Form統合
export const useSearchForm = () => {
  const { register, handleSubmit, formState } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),  // Zod連携
    defaultValues: {
      keyword: "",
      star: { min: null, max: null },
      // ...
    },
  });
  return { register, handleSubmit, errors: formState.errors };
};
```

**データ構造の設計:**
```typescript
{
  keyword: string,
  star: { min: number | null, max: number | null },
  watcher: { min: number | null, max: number | null },
  fork: { min: number | null, max: number | null },
  issue: { min: number | null, max: number | null }
}
```

**メリット:**
- ネスト構造で意味的に明確
- Zodによる型安全なバリデーション
- `z.coerce.number()`で自動型変換

---

#### 4. **GitHub API統合**

**使用場所:**
- `shared/api/github-client.ts` - 基盤
- `features/search-repositories/api/searchRepositories.ts` - 検索
- `entities/repository/api/getRepository.ts` - 詳細取得

**GitHub APIの制約と対応:**

| フィールド | API検索サポート | 実装方法 |
|-----------|----------------|---------|
| Star数 | ✅ サポート | `stars:>=1000` クエリ |
| Fork数 | ✅ サポート | `forks:100..500` クエリ |
| Watcher数 | ❌ 非サポート | クライアント側フィルタリング |
| Issue数 | ❌ 非サポート | クライアント側フィルタリング |

**実装例:**
```typescript
// buildSearchQuery.ts - APIクエリ構築
export function buildSearchQuery(data: SearchFormData): string {
  const parts = [data.keyword];

  // Star/Fork はAPI検索
  if (data.star.min) parts.push(`stars:>=${data.star.min}`);
  if (data.fork.max) parts.push(`forks:<=${data.fork.max}`);

  // Watcher/Issue はクライアント側フィルタリング
  return parts.join(' ');
}

// filterRepositories.ts - クライアント側フィルタリング
export function filterRepositories(repos: Repository[], filters: SearchFormData) {
  return repos.filter(repo => {
    if (filters.watcher.min && repo.watchers_count < filters.watcher.min) return false;
    if (filters.issue.max && repo.open_issues_count > filters.issue.max) return false;
    return true;
  });
}
```

**データフロー:**
```
GitHub API検索
  ↓ (Star/Fork絞り込み)
TanStack Query
  ↓ (キャッシュ)
filterRepositories
  ↓ (Watcher/Issue絞り込み)
表示
```

---

#### 5. **Tailwind CSS**

**設定:** `tailwind.config.ts`

**FSD対応:**
```typescript
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./shared/**/*.{js,ts,jsx,tsx,mdx}",
    "./entities/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "./widgets/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // ...
};
```

**重要:** FSDの全レイヤーを`content`に含める必要があります。

---

## プロジェクト構造

```
github-repos/
├── app/                                          # Next.js App Router
│   ├── layout.tsx                                # ルートレイアウト（Providers設定）
│   ├── page.tsx                                  # トップページ（/）
│   ├── detail/[owner]/[repo]/page.tsx            # 詳細ページ（動的ルート）
│   └── globals.css                               # グローバルスタイル
│
├── shared/                                       # 共通インフラ層
│   ├── ui/                                       # 汎用UIコンポーネント
│   │   ├── Button/Button.tsx                     # ボタン（variant対応）
│   │   ├── Input/Input.tsx                       # 入力フィールド（forwardRef）
│   │   ├── Heading/Heading.tsx                   # 見出し（h1-h3）
│   │   ├── Text/Text.tsx                         # テキスト（サイズ指定）
│   │   └── Icon/Icon.tsx                         # SVGアイコン
│   ├── lib/
│   │   └── providers.tsx                         # TanStack Query Provider
│   └── api/
│       └── github-client.ts                      # GitHub API基盤（fetch wrapper）
│
├── entities/                                     # ビジネスエンティティ層
│   └── repository/
│       ├── ui/
│       │   ├── RepositoryCard.tsx                # リポジトリカード（データ表示のみ）
│       │   ├── RepositoryStats.tsx               # 統計表示（Star/Fork等）
│       │   └── RepositoryHeader.tsx              # ヘッダー（アイコン+名前）
│       ├── model/
│       │   ├── types.ts                          # Repository型定義
│       │   └── formatters.ts                     # 数値フォーマッター
│       ├── api/
│       │   └── getRepository.ts                  # 詳細取得API
│       └── index.ts                              # Public API
│
├── features/                                     # ユーザーアクション層
│   └── search-repositories/                      # 検索機能（Search + Filter統合）
│       ├── ui/
│       │   ├── SearchForm.tsx                    # フォーム全体（統合コンポーネント）
│       │   ├── SearchInput.tsx                   # キーワード入力
│       │   ├── SearchButton.tsx                  # 検索ボタン
│       │   ├── FilterAccordion.tsx               # アコーディオン（詳細検索）
│       │   └── NumberRangeInput.tsx              # 数値範囲入力（汎用）
│       ├── model/
│       │   ├── searchSchema.ts                   # Zodスキーマ定義
│       │   ├── useSearchForm.ts                  # React Hook Form統合
│       │   ├── buildSearchQuery.ts               # GitHub APIクエリ構築
│       │   └── filterRepositories.ts             # クライアント側フィルタリング
│       ├── api/
│       │   └── searchRepositories.ts             # 検索API呼び出し
│       └── index.ts                              # Public API
│
└── widgets/                                      # ページブロック層
    ├── repository-search-page/                   # 検索ページ全体
    │   ├── ui/
    │   │   └── RepositorySearchPage.tsx          # ページレイアウト
    │   ├── model/
    │   │   └── useSearchPage.ts                  # ページ状態管理
    │   └── index.ts
    ├── repository-list/                          # リスト表示ブロック
    │   ├── ui/
    │   │   ├── RepositoryList.tsx                # リスト表示 + フィルタリング
    │   │   └── InfiniteScrollTrigger.tsx         # スクロール検知
    │   ├── model/
    │   │   └── useInfiniteRepositories.ts        # 無限スクロールロジック
    │   └── index.ts
    └── repository-detail-page/                   # 詳細ページ全体
        ├── ui/
        │   └── RepositoryDetailPage.tsx          # 詳細ページレイアウト
        └── index.ts
```

---

## セットアップ

### 前提条件
- Node.js 18.x以上
- npm または yarn

### インストール

```bash
# パッケージインストール
npm install

# 開発サーバー起動
npm run dev

# ブラウザで開く
http://localhost:3000
```

### ビルド

```bash
# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm start
```

---

## 使用方法

### 1. 基本的な検索

1. トップページ（`http://localhost:3000`）にアクセス
2. 検索キーワードを入力（例: `react`, `vue`, `typescript`）
3. 「検索」ボタンをクリック
4. 検索結果が一覧表示される

### 2. 詳細フィルター検索

1. 「詳細検索」ボタンをクリックしてフィルターを展開
2. 条件を設定:
   - **Star数**: APIで絞り込み（高速）
   - **Fork数**: APIで絞り込み（高速）
   - **Watcher数**: クライアント側フィルタリング
   - **Issue数**: クライアント側フィルタリング
3. 「検索」ボタンをクリック

**例:**
```
キーワード: react
最小Star数: 1000    ← GitHub APIで検索
最大Star数: 5000    ← GitHub APIで検索
最小Watcher数: 100  ← クライアント側でフィルタ
最大Issue数: 50     ← クライアント側でフィルタ
```

### 3. 無限スクロール

1. 検索結果が表示されている状態で下にスクロール
2. ページ下部に到達すると自動的に次の10件を読み込み
3. 「読み込み中...」と表示される間待機
4. 新しい結果が追加される

### 4. リポジトリ詳細の表示

1. リポジトリカードをクリック
2. 詳細ページ（`/detail/[owner]/[repo]`）に遷移（SSR）
3. 詳細情報を確認:
   - リポジトリ名
   - オーナー情報（アイコン、ユーザー名）
   - プログラミング言語
   - Star数、Watcher数、Fork数、Issue数
   - 説明文
4. 「戻る」ボタンで検索ページに戻る

---

## 今後の拡張性

FSDアーキテクチャにより、以下の拡張が容易です：

### 1. 新機能の追加

```bash
# 新しいFeatureを追加
features/
  bookmark-repository/      # ブックマーク機能
    ui/
    model/
    api/
    index.ts
```

**既存コードへの影響:** ゼロ（独立した機能）

### 2. マイクロフロントエンド移行

```typescript
// Module Federation対応
// widgets/ごとに別アプリケーション化可能
export { RepositorySearchPage } from './widgets/repository-search-page';
```

### 3. デザインシステムの分離

```bash
# sharedを別パッケージ化
@repo/design-system/
  ├── Button/
  ├── Input/
  └── ...
```

---
