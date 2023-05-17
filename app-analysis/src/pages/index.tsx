import {
  Box,
  Button,
  Link as ChakraLink,
  Flex,
  Image,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import Head from "next/head";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaLock } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";

import * as Yup from "yup";
import { Input } from "../components/Form/Input";
import { useAuth } from "../contexts/AuthContext";
import { withSSRGuest } from "../utils/withSSRGuest";

type SignInFormData = {
  email: string;
  password: string;
};

const signInFormSchema = Yup.object().shape({
  email: Yup.string().required("E-mail obrigatório").email("E-mail inválido"),
  password: Yup.string().required("Senha obrigatório"),
});

export default function SignIn() {
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(signInFormSchema),
  });
  const { errors } = formState;

  const { signIn } = useAuth();
  const toast = useToast();

  const HandleSignIn: SubmitHandler<SignInFormData> = async (data) => {
    const signInResponse = await signIn(data);

    if (signInResponse) {
      const { status, title } = signInResponse;

      toast({
        title: title,
        status: status,
        position: "top",
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Head>
        <title>Login | Analysis</title>
      </Head>
      <Box
        display="flex"
        h="100vh"
        alignItems="center"
        justifyContent="center"
        flexDirection={["column", "column", "column", "row"]}
        p="2rem"
      >
        <Box
          w={["95%", "80%", "80%", "full"]}
          maxW={[480, 480, 480, 380]}
          mb={["8", "8", "8", "0"]}
        >
          <Box mb="6">
            <Image
              w="10rem"
              objectFit="contain"
              src="/assets/data-analysis.png"
            />
          </Box>
          <Text
            as="h1"
            fontSize="4xl"
            fontWeight="bold"
            lineHeight={"54px"}
            color="cyan.601"
          >
            Faça seu login na plataforma
          </Text>
        </Box>
        <Flex
          as="form"
          w={["95%", "80%", "80%", "full"]}
          maxW={480}
          bg="white"
          p={["2rem", "2rem", "2rem", "4.5rem"]}
          borderRadius={8}
          flexDir="column"
          onSubmit={handleSubmit(HandleSignIn as any)}
        >
          <Stack spacing="2">
            <Input
              iconLeft={IoMdMail}
              placeholder="E-mail"
              type="email"
              error={
                !!errors?.email?.message
                  ? String(errors?.email?.message)
                  : undefined
              }
              {...register("email")}
            />
            <Input
              iconLeft={FaLock}
              placeholder="Senha"
              isPassword
              error={
                !!errors?.password?.message
                  ? String(errors?.password?.message)
                  : undefined
              }
              {...register("password")}
            />
          </Stack>

          <Link href="/forgot" passHref>
            <ChakraLink
              mt="2"
              fontWeight="bold"
              color="cyan.601"
              _hover={{
                textDecoration: "none",
                filter: "brightness(1.2)",
              }}
              transition=" all 0.3s"
            >
              Esqueci minha senha
            </ChakraLink>
          </Link>

          <Button
            type="submit"
            mt="6"
            size="lg"
            isLoading={formState.isSubmitting}
            color="white"
            colorScheme="cyan"
            bg="cyan.601"
            _hover={{
              textDecoration: "none",
              filter: "brightness(1.1)",
            }}
            transition=" all 0.3s"
          >
            ENTRAR
          </Button>

          <Box mt="2rem">
            Não tem uma conta?
            <Link href="/signup" passHref>
              <ChakraLink
                mt="2"
                fontWeight="bold"
                color="cyan.601"
                _hover={{
                  textDecoration: "none",
                  filter: "brightness(1.2)",
                }}
                transition=" all 0.3s"
              >
                {" "}
                Registre-se
              </ChakraLink>
            </Link>
          </Box>
        </Flex>
      </Box>
    </>
  );
}

export const getServerSideProps = withSSRGuest<{}>(async (ctx) => {
  return {
    props: {},
  };
});
