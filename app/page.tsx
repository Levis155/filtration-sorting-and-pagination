import { Flex, Table, Text } from "@radix-ui/themes";
import Link from "next/link";
import IssueStatusBadge from "./IssueStatusBadge";
import { Issue, Status } from "./generated/prisma/client";
import prisma from "@/prisma/client";
import IssueStatusFilter from "./IssueStatusFilter";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import Pagination from "./Pagination";
import IssuesTable, { columnNames, IssueQuery } from "./IssuesTable";

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

  const page = parseInt(resolvedSearchParams.page) || 1;
  const pageSize = 5;

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
