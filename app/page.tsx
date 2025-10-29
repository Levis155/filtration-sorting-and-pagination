import prisma from "@/prisma/client";
import IssueStatusFilter from "./IssueStatusFilter";
import IssuesTable, { columnNames, IssueQuery } from "./IssuesTable";
import Pagination from "./Pagination";
import { Status } from "./generated/prisma/enums";
import { Flex } from "@radix-ui/themes";

interface Props {
  searchParams: IssueQuery;
}

const HomePage = async ({ searchParams }: Props) => {
  const resolvedSearchParams = await searchParams;

  const statuses = Object.values(Status);

  const status = statuses.includes(resolvedSearchParams.status)
    ? resolvedSearchParams.status
    : undefined;

  const orderBy = columnNames.includes(resolvedSearchParams.orderBy)
    ? { [resolvedSearchParams.orderBy]: "asc" }
    : undefined;

  const page = parseInt(resolvedSearchParams.page) || 1;
  const pageSize = 10;

  const issues = await prisma.issue.findMany({
    where: { status },
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const issueCount = await prisma.issue.count({ where: { status } });

  return (
    <Flex direction="column" gap="3">
      <IssueStatusFilter />
      <IssuesTable searchParams={searchParams} issues={issues} />
      <Pagination
        pageSize={pageSize}
        currentPage={page}
        itemCount={issueCount}
      />
    </Flex>
  );
};

export default HomePage;
