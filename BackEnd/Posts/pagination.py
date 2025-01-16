from rest_framework.pagination import PageNumberPagination


class CustomPagination(PageNumberPagination):
    page_size = 2  # Default items per page
    page_size_query_param = 'page_size'  # Allow client to specify page size
    max_page_size = 50  # Limit the maximum items per page
