# CORS is not needed: the Vite dev server proxies /api/* to Rails in development,
# and the ALB routes by path in production — both result in same-origin requests.
