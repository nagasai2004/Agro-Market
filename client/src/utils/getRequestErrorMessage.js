export function getRequestErrorMessage(error, fallbackMessage) {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.code === "ERR_NETWORK") {
    return "Cannot reach the AgroConnect backend. Make sure the server is running on port 5000.";
  }

  if (error?.message) {
    return error.message;
  }

  return fallbackMessage;
}

