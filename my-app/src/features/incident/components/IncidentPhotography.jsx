import { useState, useEffect } from "react";
import { getIncidentPhotographyById } from "@/features/incident/services/incidentApi";



const IncidentPhotography = ({ idPhotography }) => {
  const [urlPhotography, setUrlPhotography] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIncidentPhotography = async () => {
        try {
            setIsLoading(true);
            const { url = ""} = await getIncidentPhotographyById(idPhotography);
            setUrlPhotography(url);
        } catch (error) {
            console.error("Error fetching incident photography:", error);
        } finally {
            setIsLoading(false);
        }
      setUrlPhotography(url);
    }
    fetchIncidentPhotography();
  }, [idPhotography]);

  // "photographs": [
  //                 {
  //                     "id_photography": 31,
  //                     "name": "foto2.jpg",
  //                     "content_type": "image/jpeg",
  //                     "file_size": 595630,
  //                     "r2_key": "incidents/36/20250904_160210",
  //                     "upload_date": "2025-09-04T16:02:13.129643Z"
  //                 },
  //                 {
  //                     "id_photography": 32,
  //                     "name": "foto3.jpg",
  //                     "content_type": "image/jpeg",
  //                     "file_size": 398764,
  //                     "r2_key": "incidents/36/20250904_160213",
  //                     "upload_date": "2025-09-04T16:02:15.390297Z"
  //                 }
  //             ],

  return (
    <div className="min-w-20 flex items-top justify-center">
      {isLoading || urlPhotography === "" ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-2 w-2 border-b-1 border-primary"></div>
        </div>
      ) : (
        <img
          className="h-auto max-w-full w-20 aspect-4/3 object-cover"
          src={urlPhotography}
          alt="image description"
        />
      )}
      
    </div>
  );
};

export default IncidentPhotography;
