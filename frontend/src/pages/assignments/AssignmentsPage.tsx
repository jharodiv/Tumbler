import { useSearchParams } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { assignmentApi } from "@/api/endpoints";
import { queryKeys } from "@/api/queryKeys";
import type { AssignmentFilters } from "@/api/types";
import PageHeader from "@/components/PageHeader";
import Pagination from "@/components/Pagination";
import { EmptyState, ErrorMessage, Loading } from "@/components/Feedback";
import AssignmentsTable from "@/pages/assignments/AssignmentsTable";

const PAGE_SIZE = 20;

export default function AssignmentsPage() {
    const [params, setParams] = useSearchParams();
    const activeParam = params.get("active");

    const filters: AssignmentFilters = {
        page: Number(params.get("page")) || 1,
        limit: PAGE_SIZE,
        active: activeParam === "true" ? true : activeParam === "false" ? false : undefined,
    };

    const { data, error, isPending, refetch } = useQuery({
        queryKey: queryKeys.assignmentList(filters),
        queryFn: () => assignmentApi.list(filters),
        placeholderData: keepPreviousData,
    });

    const setParam = (key: string, value: string) => {
        setParams((prev) => {
            const next = new URLSearchParams(prev);
            if (value) next.set(key, value);
            else next.delete(key);
            if (key !== "page") next.delete("page");
            return next;
        });
    };

    return (
        <>
            <PageHeader title="Assignments" subtitle="Every hand-over and return, newest first." />

            <div className="toolbar">
                <select
                    className="select"
                    aria-label="Filter by state"
                    value={activeParam ?? ""}
                    onChange={(e) => setParam("active", e.target.value)}
                >
                    <option value="">All assignments</option>
                    <option value="true">Still out</option>
                    <option value="false">Returned</option>
                </select>
            </div>

            {isPending ? (
                <Loading />
            ) : error ? (
                <ErrorMessage error={error} onRetry={refetch} />
            ) : data.assignments.length === 0 ? (
                <EmptyState title="No assignments found" />
            ) : (
                <>
                    <AssignmentsTable assignments={data.assignments} />
                    <Pagination
                        page={data.page}
                        totalPages={data.totalPages}
                        total={data.total}
                        onChange={(page) => setParam("page", String(page))}
                    />
                </>
            )}
        </>
    );
}
