import prisma from "@/prisma/client";
import { Flex } from "@radix-ui/themes";
import IssueStatusFilter from "./IssueStatusFilter";
import IssuesTable, { columnNames, IssueQuery } from "./IssuesTable";
import Pagination from "./Pagination";
import { Issue, Status } from "./generated/prisma/client";

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

  const pageSize = 5;
  const page = parseInt(resolvedSearchParams.page) || 1;

  const issues: Issue[] = await prisma.issue.findMany({
    where: { status },
    orderBy,
    skip: (page - 1) * pageSize,
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
        itemCount={issueCount}
        pageSize={pageSize}
        currentPage={page}
      />
    </Flex>
  );
};

export default HomePage;
