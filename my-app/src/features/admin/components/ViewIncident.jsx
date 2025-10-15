import { IncidentDetail } from "@/features/incident/components/IncidentDetail";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import useWindowStore from "@/shared/store/windowStore";
import useIncidentsStore from "@/features/incident/store/incidentStore";
import useMapExplorerStore from "@/features/mapExplorer/store/mapExplorerStore";
import MapExpander from "@/features/mapExplorer/components/MapExpander";
import MapView from "@/features/mapExplorer/components/MapView";

const ViewIncident = ({ openModal, setOpenModal }) => {
  const isMobile = useWindowStore((state) => state.isMobile);
  const expandMap = useMapExplorerStore((state) => state.expandMap);

  const setSelectedIncident = useIncidentsStore(
    (state) => state.setSelectedIncident
  );
  const setExpandMap = useMapExplorerStore((state) => state.setExpandMap);
  const selectedIncident = useIncidentsStore((state) => state.selectedIncident);

  return (
    <>
      <Modal
        show={openModal}
        onClose={() => setOpenModal(false)}
        className="bg-secondary text-primary relative z-[99999]"
      >
        <ModalHeader className="bg-secondary"><span className="text-primary">Incidencia</span></ModalHeader>
        <ModalBody className="bg-secondary text-primary">
       
          <div className="flex flex-col bg-secondary flex-auto h-[200px] border-2 border-gray-300">
            <MapView
              isMobile={true}
              selectedIncident={selectedIncident}
              setSelectedIncident={setSelectedIncident}
            />
          </div>
          <IncidentDetail
            isMobile={isMobile}
            setSelectedIncident={setSelectedIncident}
            setExpandMap={setExpandMap}
            incident={selectedIncident}
            showCloseButton={false}
          />
        </ModalBody>
        {/* <ModalFooter className="bg-secondary text-primary">
          <Button onClick={() => setOpenModal(false)}>I accept</Button>
          <Button color="alternative" onClick={() => setOpenModal(false)}>
            Decline
          </Button>
        </ModalFooter> */}
      </Modal>
    </>
  );
};

export default ViewIncident;
