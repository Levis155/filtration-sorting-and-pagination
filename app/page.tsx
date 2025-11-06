import prisma from "@/prisma/client";
import { Flex } from "@radix-ui/themes";
import IssueStatusFilter from "./IssueStatusFilter";
import IssuesTable, { columnNames } from "./IssuesTable";
import Pagination from "./Pagination";
import { Issue, Status } from "./generated/prisma/browser";

interface Props {
  searchParams: { status: Status; orderBy: keyof Issue; page: string };
}

const HomePage = async ({ searchParams }: Props) => {
  const resolvedSearchParams = await searchParams;

  const status = Object.values(Status).includes(resolvedSearchParams.status)
    ? resolvedSearchParams.status
    : undefined;

  const orderBy = columnNames.includes(resolvedSearchParams.orderBy)
    ? { [resolvedSearchParams.orderBy]: "asc" }
    : undefined;

  const currentPage = parseInt(resolvedSearchParams.page) || 1;
  const pageSize = 10;

  const issues: Issue[] = await prisma.issue.findMany({
    where: { status },
    orderBy,
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  const issueCount = await prisma.issue.count({
    where: { status },
  });
  return (
    <Flex direction="column" gap="3">
      <IssueStatusFilter />
      <IssuesTable searchParams={searchParams} issues={issues} />
      <Pagination
        currentPage={currentPage}
        itemCount={issueCount}
        pageSize={pageSize}
      />
    </Flex>
  );
};

export default HomePage;
