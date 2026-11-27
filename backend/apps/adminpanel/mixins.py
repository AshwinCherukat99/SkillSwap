from apps.adminpanel.pagination import AdminPagination

class AdminPaginationMixin:
    pagination_class=AdminPagination
    def paginate_queryset(self,queryset):
        self.paginator=self.pagination_class()
        return self.paginator.paginate_queryset(
            queryset,
            self.request,
            view=self
        )
    def get_pagination_metadata(self):
        if not hasattr(self,'paginator'):
            return {}
        response=self.paginator.get_paginated_response([])
        return {
            key:value
            for key,value in response.data.items()
            if key!='results'
        }