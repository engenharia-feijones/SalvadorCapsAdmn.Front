<template>
    <v-container>
        <v-row dense align="center" justify="center">
            <v-col cols="12" lg="4" xl="4" md="4" sm="12" xs="12">
            <v-card
                color="#424242"
                dark
            >
                <v-card-title class="text-h5">
                    Área de acesso
                </v-card-title>
                <v-form ref="form"
                v-model="valid"
                lazy-validation>
                    <v-card-text>
                        <v-text-field
                            label="Usuário"
                            v-model="usuario.login"
                            prepend-inner-icon="mdi-account"
                            :rules="[v => !!v || 'Usuário é um campo obrigatório.']"
                            v-show="!esqueci_senha"
                        ></v-text-field>
                        <v-text-field
                            v-model="usuario.password"
                            label="Senha"
                            type="password"
                            prepend-inner-icon="mdi-lock"
                            :rules="[v => !!v || 'Senha é um campo obrigatório.']"
                            v-show="!esqueci_senha"
                        ></v-text-field>
                        <v-text-field
                            label="Informe o e-mail cadastrado"
                            prepend-inner-icon="mdi-email"
                            :rules="[v => !!v || 'E-mail é um campo obrigatório.']"
                            v-if="esqueci_senha"
                        ></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn text v-show="!esqueci_senha" @click="autenticacao()">
                            Entrar
                        </v-btn>
                        <v-btn text v-show="!esqueci_senha" @click="esqueci_senha = true">
                            Esqueci minha senha
                        </v-btn>                    
                        <v-btn text @click="esqueci_senha = false" v-show="esqueci_senha">
                            Resetar senha
                        </v-btn>
                        <v-btn text @click="esqueci_senha = false" v-show="esqueci_senha">
                            Cancelar
                        </v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
export default {
  data () {
    return {
      esqueci_senha: false,
      usuario: {
        login: '',
        password: ''
      },
      valid: false
    }
  },
  methods: {
    autenticacao() {
      console.log(this.$refs.form.validate())
      if (this.$refs.form.validate()) {
        if (this.usuario.login === 'adm' && this.usuario.password === 'admin') {
            localStorage.setItem('autenticado', true)
            this.$router.replace({name: 'Marca'})
        } else {
          this.$toast.error('Usuário ou senha incorreto(s)', {
            position: 'top'
          });
          this.usuario.password = ''
        }
      }
    }
  }
}
</script>
<style>
</style>