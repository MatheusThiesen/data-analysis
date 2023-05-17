import {
  Box,
  Button,
  Link as ChakraLink,
  Flex,
  Icon,
  Image,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import Head from "next/head";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaArrowLeft, FaLock, FaStore, FaUserAlt } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";

import * as Yup from "yup";
import { Input } from "../components/Form/Input";
import { useAuth } from "../contexts/AuthContext";
import { regexHelper } from "../helpers/regex";
import { withSSRGuest } from "../utils/withSSRGuest";

type SignInFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  cnpj: string;
  companyName: string;
  tradeName: string;
};

const signUpFormSchema = Yup.object().shape({
  name: Yup.string().required("Nome obrigatório"),
  email: Yup.string().required("E-mail obrigatório").email("E-mail inválido"),
  password: Yup.string()
    .matches(
      regexHelper.password,
      "A senha precisa conter letras e números, no mínimo 8 caracteres, uma letras maiúscula e um carácter especial."
    )
    .required("nova senha é obrigatório"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "As senhas precisam ser iguais ")
    .required("Confirmação de senha é obrigatório"),

  cnpj: Yup.string()

    .matches(regexHelper.cnpj, "CNPJ inválido.")
    .required("CNPJ obrigatório"),
  companyName: Yup.string().required("Razão social obrigatório"),
  tradeName: Yup.string().required("Nome fantasia obrigatório"),
});

export default function SignUp() {
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(signUpFormSchema),
  });
  const { errors } = formState;

  const { signUp } = useAuth();
  const toast = useToast();

  const HandleSignUp: SubmitHandler<SignInFormData> = async (data) => {
    const signInResponse = await signUp(data);

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
        <title>Cadastro | Analysis</title>
      </Head>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection={["column", "column", "column", "row-reverse"]}
        minH="100vh"
        p="2rem"
      >
        <Box
          w={["95%", "80%", "80%", "full"]}
          maxW={[480, 480, 480, 380]}
          mb={["8", "8", "8", "0"]}
          pl={[0, 0, 0, 100]}
        >
          <Box mb="6">
            <Image
              w="10rem"
              objectFit="contain"
              src="/assets/data-analysis.png"
            />
          </Box>

          <Link href="/" passHref>
            <ChakraLink
              mt="2"
              fontWeight="bold"
              color="cyan.601"
              _hover={{
                textDecoration: "none",
                filter: "brightness(1.2)",
              }}
              transition=" all 0.3s"
              display={"flex"}
              alignItems={"center"}
            >
              <Icon as={FaArrowLeft} color="cyan.601" mr="2" />
              Voltar para login
            </ChakraLink>
          </Link>
        </Box>

        <Flex
          as="form"
          w={["95%", "80%", "80%", "full"]}
          maxW={480}
          bg="white"
          p={["2rem", "2rem", "2rem", "4.5rem"]}
          borderRadius={8}
          flexDir="column"
          onSubmit={handleSubmit(HandleSignUp as any)}
        >
          <Text as="h1" fontWeight="bold" fontSize="3xl" mb="2.5rem">
            Crie sua conta
          </Text>

          <Stack spacing="2">
            <Input
              iconLeft={IoMdMail}
              placeholder="Seu E-mail"
              type="email"
              error={
                !!errors?.email?.message
                  ? String(errors?.email?.message)
                  : undefined
              }
              {...register("email")}
            />
            <Input
              iconLeft={FaUserAlt}
              placeholder="Seu Nome"
              error={
                !!errors?.name?.message
                  ? String(errors?.name?.message)
                  : undefined
              }
              {...register("name")}
            />
            <Input
              iconLeft={FaLock}
              placeholder="Sua Senha"
              isPassword
              error={
                !!errors?.password?.message
                  ? String(errors?.password?.message)
                  : undefined
              }
              {...register("password")}
            />
            <Input
              iconLeft={FaLock}
              placeholder="Confirme Sua Senha"
              isPassword
              error={
                !!errors?.confirmPassword?.message
                  ? String(errors?.confirmPassword?.message)
                  : undefined
              }
              {...register("confirmPassword")}
            />
          </Stack>

          <Text fontWeight="bold" fontSize="lg" mt="2rem" mb="1rem">
            Sua Empresa
          </Text>

          <Stack spacing="2">
            <Input
              iconLeft={FaStore}
              placeholder="CNPJ"
              error={
                !!errors?.cnpj?.message
                  ? String(errors?.cnpj?.message)
                  : undefined
              }
              {...register("cnpj")}
            />
            <Input
              iconLeft={FaStore}
              placeholder="Razão social"
              error={
                !!errors?.companyName?.message
                  ? String(errors?.companyName?.message)
                  : undefined
              }
              {...register("companyName")}
            />
            <Input
              iconLeft={FaStore}
              placeholder="Nome fantasia"
              error={
                !!errors?.tradeName?.message
                  ? String(errors?.tradeName?.message)
                  : undefined
              }
              {...register("tradeName")}
            />
          </Stack>

          <Button
            type="submit"
            mt="3rem"
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
            CADASTRAR
          </Button>
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
