<template>
    <v-data-table
    :headers="cabecalho"
    :items="marcas"
    sort-by="nome"
    >
        <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title>Marcas</v-toolbar-title>
                <v-divider
                    class="mx-4"
                    inset
                    vertical
                ></v-divider>
                <v-spacer></v-spacer>
                
                <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{on,attrs}">
                        <v-btn color="white" darkr v-bind="attrs" v-on="on">
                                NEW
                        </v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="headline" >Nova Marca</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                             <v-row>

                                <v-col cols="12" sm="4" md="6">
                                    <v-text-field
                                         v-model="editedItem.nome"
                                         label="Nome">
                                    </v-text-field>
                                </v-col>

                                <v-col cols="12" sm="6" md="12" lg="12">
                                        <v-btn small fab class="txtBtn">
                                            <v-file-input
                                               
                                                @change="previwerimage"
                                                class="ml-2 mb-2"
                                                prepend-icon="mdi-remote-desktop"
                                                filled
                                                hide-input>
                                            </v-file-input>
                                        </v-btn>
                                            <label class="ml-4">Imagem Desktop</label>
                                            <v-img  :src="editedItem.imagemDesktop.url"></v-img>
                                </v-col>

                             </v-row>
                            </v-container>
                        </v-card-text>
                    </v-card>
                </v-dialog>
                
            </v-toolbar>
        </template>
    </v-data-table>
</template>
<script>
export default {
    name: 'Marca',

   

    data:()=>({
        dialog:false,
            
        cabecalho:
            [
                {text:'Nome',align:'start',value:'nome'},
                {text:'ImagemDesktop', align:'Start',value:'imagemDesktop'},
                {text:'ImagemMobile',align:'Start',value:'imagemMobile'}

                
            ],
        marcas:
            [
                
            ],
        editedItem:
            
                {
                    nome:'',
                    imagemDesktop:
                    {
                        nome:'',
                        url: 'a'
                    }
                        
                    ,
                    imagemMobile:
                    {
                        nome:'',
                        url:'',
                    }

                    

                }
            
            

    }),

    created() {
        console.log(this.editedItem.imagemDesktop.url)
    },
    methods:{
        previwerimage(payload){
            const file = payload
      

             this.editedItem.imagemDesktop.url=window.URL.createObjectURL(file)
        
       
               
         
        }
    }

}
</script>


<style>
  
</style>