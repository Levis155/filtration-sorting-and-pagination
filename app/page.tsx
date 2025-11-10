import prisma from "@/prisma/client";
import { Flex } from "@radix-ui/themes";
import { Issue, Status } from "./generated/prisma/browser";
import IssuesTable, { columnNames, IssueQuery } from "./IssuesTable";
import IssueStatusFilter from "./IssueStatusFilter";
import Pagination from "./Pagination";

interface Props {
  searchParams: IssueQuery;
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
      <IssuesTable issues={issues} searchParams={searchParams} />
      <Pagination
        itemCount={issueCount}
        pageSize={pageSize}
        currentPage={currentPage}
      />
    </Flex>
  );
};

export default HomePage;
