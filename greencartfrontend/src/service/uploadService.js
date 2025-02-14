export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
  
    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      console.log("Cloudinary Response:", data); // Debugging
  
      if (!response.ok) {
        throw new Error(data.error || "Failed to upload");
      }
  
      return data.imageUrl; // ✅ Cloudinary Image URL
  
    } catch (error) {
      console.error("Upload failed:", error);
      return null;
    }
  };
  