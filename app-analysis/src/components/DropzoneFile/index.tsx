import { Box, Button, Flex, FlexProps, Icon, Text } from "@chakra-ui/react";
import { filesize } from "filesize";
import { BsFiletypeCsv } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";

interface DropzoneFileProps extends FlexProps {
  onTrash?: (f: File) => void;

  file: File;
}

export const DropzoneFile = ({ file, onTrash }: DropzoneFileProps) => {
  const filesizeFotmat = filesize(file.size);

  return (
    <Flex mt="4">
      <Icon as={BsFiletypeCsv} fontSize={"3rem"} />
      <Flex justify="space-between" w="full">
        <Box>
          <Text mr="2" fontSize="md">
            {file.name}
          </Text>
          <Text fontSize="sm" fontWeight="light" color="gray.700">
            {filesizeFotmat.toString()}
          </Text>
        </Box>

        {onTrash && (
          <Button onClick={() => onTrash(file)}>
            <IoMdTrash size={30} />
          </Button>
        )}
      </Flex>
    </Flex>
  );
};
