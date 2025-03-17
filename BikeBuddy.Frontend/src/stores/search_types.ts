export interface SearchDto{
    offset: number,
    limit: number;
};


export interface SearchFilterDto<Type> extends SearchDto {
    filter: Type | null
}

export interface PageData<Type>{
    body: Array<Type>;
    total: number,
}