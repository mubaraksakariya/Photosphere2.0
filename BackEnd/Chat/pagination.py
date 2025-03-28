from rest_framework.pagination import PageNumberPagination


class CustomPageNumberPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

    # def get_paginated_response(self, data):
    #     # Customize the response format
    #     return Response({
    #         'links': {
    #             'next': self.get_next_link(),
    #             'previous': self.get_previous_link(),
    #         },
    #         'count': self.page.paginator.count,
    #         'results': data,
    #     })
