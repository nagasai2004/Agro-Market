export function getDashboardRoute(role) {
  switch (role) {
    case "farmer":
      return "/farmer";
    case "admin":
      return "/admin";
    case "consumer":
    default:
      return "/consumer";
  }
}

