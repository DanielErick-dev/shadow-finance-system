"use client"

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@base/components/ui/pagination"

type ReusablePaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page:number) => void;
    className?: string;
}

export default function ReusablePagination({
    currentPage,
    totalPages,
    onPageChange,
    className = ''
}: ReusablePaginationProps){
    if(totalPages < 1) return null;
    return(
        <Pagination className={className}>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious 
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) onPageChange(currentPage - 1);
                        }}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50': 'hover:bg-slate-800'}
                    />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <PaginationItem key={page}>
                        <PaginationLink
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                onPageChange(page);
                            }}
                            isActive={page === currentPage}
                            className={page === currentPage ? 'bg-purple-600 text-white hover:bg-purple-700': 'hover:bg-slate-800'}
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                ))}
                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) onPageChange(currentPage + 1);
                        }}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-slate-800'}                   
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}