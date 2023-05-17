import {
  Box,
  Button,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { api } from "../../service/apiClient";
import { Dropzone } from "../Dropzone";
import { DropzoneFile } from "../DropzoneFile";

interface ModalImportFinanceProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalImportFinance = ({
  isOpen,
  onClose,
}: ModalImportFinanceProps) => {
  const [fileFinanceReleases, setFileFinanceReleases] = useState<
    File | undefined
  >();
  const [fileFinancePlans, setFileFinancePlans] = useState<File | undefined>();

  async function handleImportFile() {
    try {
      if (fileFinanceReleases && fileFinancePlans) {
        const formDateFinanceReleases = new FormData();
        formDateFinanceReleases.append("file", fileFinanceReleases);

        const formDateFinancePlans = new FormData();
        formDateFinancePlans.append("file", fileFinancePlans);

        // await api.post("/finance/plans/import", formDateFinancePlans);
        await api.post("/finance/releases/import", formDateFinanceReleases);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Modal
      onClose={onClose}
      size={"6xl"}
      isOpen={isOpen}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Stack>
            <Box>
              <Button variant="unstyled" onClick={onClose}>
                <Icon as={IoArrowBack} fontSize="1.8rem" />
              </Button>
            </Box>

            <Flex align="center" justify="center">
              <Text fontSize="2xl">Importar dados</Text>
            </Flex>
          </Stack>
        </ModalHeader>
        <ModalBody p="2rem">
          <Stack spacing="4" direction="row">
            <Box w="full">
              <Flex align="center" mb="4">
                <Text fontWeight="light" fontSize="lg" mr="4">
                  Lançamentos
                </Text>
                <Button size="sm" colorScheme="green">
                  Arquivo Modelo
                </Button>
              </Flex>
              <Dropzone onFileUploaded={(e) => setFileFinanceReleases(e)} />
              {fileFinanceReleases && (
                <DropzoneFile
                  file={fileFinanceReleases}
                  onTrash={() => setFileFinanceReleases(undefined)}
                />
              )}
            </Box>
            <Box w="full">
              <Flex align="center" mb="4">
                <Text fontWeight="light" fontSize="lg" mr="4">
                  Plano Contábil
                </Text>
                <Button size="sm" colorScheme="green">
                  Arquivo Modelo
                </Button>
              </Flex>
              <Dropzone onFileUploaded={(e) => setFileFinancePlans(e)} />
              {fileFinancePlans && (
                <DropzoneFile
                  file={fileFinancePlans}
                  onTrash={() => setFileFinancePlans(undefined)}
                />
              )}
            </Box>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button
            size="lg"
            w="full"
            color="white"
            colorScheme="cyan"
            bg="cyan.601"
            _hover={{
              textDecoration: "none",
              filter: "brightness(1.1)",
            }}
            transition=" all 0.3s"
            onClick={handleImportFile}
          >
            Importar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
