import { getRepository, toRepositoryDetail } from "@/entities/repository";
import { RepositoryDetailPage } from "@/widgets/repository-detail-page";

interface DetailPageProps {
  params: Promise<{
    owner: string;
    repo: string;
  }>;
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { owner, repo } = await params;
  const response = await getRepository(owner, repo);

  // APIレスポンスをフロントエンド用の型に変換
  const repository = toRepositoryDetail(response);

  return <RepositoryDetailPage repository={repository} />;
}
