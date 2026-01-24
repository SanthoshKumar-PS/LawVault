import { toast } from "sonner";

export const handleApiError = (error: any, message?: string) => {
  console.log("Error occured in fetchFoldersAndFiles: ", error);
  const status = error.response?.status;
  const serverMessage = error.response?.data.message || error.response?.data;
  const errorMessage = serverMessage || "Something went wrong";
  console.log("errorMessage: ", errorMessage);
  switch (status) {
    case 401:
      toast.error("Session expired", {
        description: "Please login again to continue.",
      });
      break;
    case 403:
      toast.error("Access Denied", {
        description: "You do not have permission to view this folder.",
      });
      break;
    case 404:
      toast.error("Not Found", {
        description: "The requested folder does not exist.",
      });
      break;
    case 500:
      toast.error("Server Error", {
        description: "Our legal vault is temporarily down. Try again later.",
      });
      break;
    default:
      toast.error("Connection Error", { description: errorMessage });
  }
};
