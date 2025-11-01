import { getRepository } from "@/entities/repository";
import { RepositoryDetailPage } from "@/widgets/repository-detail-page";

interface DetailPageProps {
  params: Promise<{
    owner: string;
    repo: string;
  }>;
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { owner, repo } = await params;
  const repository = await getRepository(owner, repo);

  return <RepositoryDetailPage repository={repository} />;
}
