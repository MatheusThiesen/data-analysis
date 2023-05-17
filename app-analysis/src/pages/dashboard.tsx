import { Box, Button, Flex, Icon, useDisclosure } from "@chakra-ui/react";
import Head from "next/head";
import { BiImport } from "react-icons/bi";
import { SiMicrosoftexcel } from "react-icons/si";
import { Me } from "../@types/me";
import { HeaderNavigation } from "../components/HeaderNavigation";
import { HeaderToList } from "../components/HeaderToList";
import { ModalImportFinance } from "../components/ModalImportFinance";
import { PanelLayout } from "../components/PanelLayout";
import { setupAPIClient } from "../service/api";
import { withSSRAuth } from "../utils/withSSRAuth";

interface HomeProps {
  me: Me;
}

export default function Home({ me }: HomeProps) {
  const { onOpen, isOpen, onClose } = useDisclosure();

  function handleExportList() {}

  return (
    <>
      <Head>
        <title>Inicio | Analysis</title>
      </Head>

      <HeaderNavigation isInativeEventScroll user={{ name: me.email }} />

      <PanelLayout>
        <Box w="full">
          <HeaderToList title="Dados" isLoading={false} total={0}>
            <Button type="button" ml="2" onClick={handleExportList}>
              <Icon
                as={SiMicrosoftexcel}
                fontSize="1.5rem"
                color="#147b45"
                ml="-1"
              />
            </Button>
            <Button type="button" ml="2" onClick={onOpen}>
              <Icon as={BiImport} fontSize="1.5rem" color="cyan.601" />
            </Button>
          </HeaderToList>

          <Flex w="100%" justify="center" align="center"></Flex>
        </Box>
      </PanelLayout>

      <ModalImportFinance isOpen={isOpen} onClose={onClose} />
    </>
  );
}

export const getServerSideProps = withSSRAuth<{}>(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  const response = await apiClient.get("/auth/me");

  return {
    props: {
      me: response.data,
    },
  };
});
