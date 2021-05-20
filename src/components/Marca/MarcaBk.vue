<template>
    <v-data-table
    :headers="cabecalho"
    :items="brands"
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
                    <v-card  >
                        <v-card-title>
                            <span class="headline" >Nova Marca</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                             <v-row justify="center" align="center">

                                <v-col class="mb-0 pb-0"  cols="12" sm="6" md="12">
                                    <v-text-field
                                        
                                        outlined
                                         v-model="editedItem.nome"
                                         label="Nome">
                                    </v-text-field>
                                </v-col>

                                <v-col class="mb-0 ml-2" >
                                    <v-row  align="center">
                                        <v-checkbox value></v-checkbox>
                                    <p class="mt-4">Promocional</p>
                                    </v-row>
                                </v-col>

                                <!-- START UPLOAD IMG DESKTOP -->

                                <v-col  cols="12" sm="6" md="12" lg="12">
                                    <v-card style="background: #0b7ad1;">
                                        <v-btn small fab class=" mb-2 mt-2 ml-2 txtBtn">
                                            <v-file-input
                                                accept="image/png, image/jpeg, image/bmp"
                                                @change="previwerimage"
                                                class="ml-2 mb-2"
                                                prepend-icon="mdi-remote-desktop"
                                                filled
                                                hide-input>
                                            </v-file-input>
                                        </v-btn>
                                                <label style="color:white;" class="ml-4">Imagem Desktop</label>
                                    </v-card>
                                            <v-card height="auto" class="mt-3" elevation="1">
                                                    <v-row class="ml-4"  justify="start" >
                                                        <v-col cols="3">
                                                            <v-card elevation="0">
                                                                <v-img class="mt-2" max-height="70px" max-width="70px" :src="editedItem.imagemDesktop.url"></v-img>
                                                            </v-card>
                                                        </v-col>
                                                            <v-col align="start" cols="6">
                                                                 <p style="font-size:10px" v-if="editedItem.imagemDesktop.nome">{{editedItem.imagemDesktop.nome}}</p>
                                                            </v-col>
                                                            <v-col class="btnX" align="end" cols="1">
                                                                <v-btn @click="editedItem.imagemDesktop.url='',editedItem.imagemDesktop.nome=''" v-if="editedItem.imagemDesktop.url" text fab small>
                                                                     <v-icon small >mdi-delete</v-icon>
                                                                </v-btn>
                                                            </v-col>
                                                    </v-row>
                                                    
                                                    
                                            </v-card>    
                                </v-col>

                                <!-- END UPLOAD IMG DESKTOP -->


                                <!-- STARTP UPLOAD IMG MOBILE -->

                                <v-col cols="12" sm="6" md="12" lg="12">
                                <v-card style="background: #0b7ad1;">
                                    <v-btn small fab class="mb-2 mt-2 ml-2 txtBtn">
                                        <v-file-input
                                            accept="image/png, image/jpeg, image/bmp"
                                            @change="previwerImageMob"
                                            class="ml-2 mb-2"
                                            prepend-icon="mdi-cellphone"
                                            filled
                                            hide-input>
                                        </v-file-input>
                                    </v-btn>
                                        <label style="color:white;" class="ml-4">Imagem Mobile</label>
                                </v-card>
                                        <v-card  class="mt-3">
                                            <v-row class="ml-4" justify="start">
                                                <v-col cols="3">
                                                    <v-card  elevation="0" >
                                                        <v-img class="mt-2"  max-height="70" max-width="70" :src="editedItem.imagemMobile.url"></v-img>
                                                    </v-card>
                                                </v-col>
                                                 <v-col  align="start" cols="6">
                                                    <p class="mt-2" style=" font-size:10px; width:100px " v-if="editedItem.imagemMobile.nome">{{editedItem.imagemMobile.nome}}</p>
                                                </v-col>
                                                <v-col class="btnX" align="end" cols="1">
                                                    <v-btn @click="editedItem.imagemMobile.url='',editedItem.imagemMobile.nome=''" v-if="editedItem.imagemMobile.url" text fab small>
                                                        <v-icon small >mdi-delete</v-icon>
                                                    </v-btn>
                                                </v-col>
                                            </v-row>

                                          
                                        </v-card>
                                </v-col>

                                <!-- END UPLOAD IMG MOBILE -->
                                
                                <v-col class="mt-6" >
                                    <v-row justify="end">
                                        <v-btn small text> 
                                            <v-icon color="primary"  small>
                                                mdi-check
                                            </v-icon>
                                            <a  class="ml-1">Save</a>
                                        </v-btn>
                                        <v-btn small text
                                         @click="editedItem.imagemDesktop.url='',editedItem.imagemDesktop.nome='',editedItem.imagemMobile.url='',editedItem.imagemMobile.nome='',editedItem.nome='', dialog=false">
                                            <v-icon small color="error" >
                                                mdi-close
                                            </v-icon>
                                            <a class="ml-1" style="color:Red" >Cancel</a>
                                        </v-btn>
                                    </v-row>
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
        brands:
            [
                
            ],
        editedItem:
            
                {
                    nome:'',
                    imagemDesktop:
                    {
                        nome:'',
                        url: ''
                    }
                        
                    ,
                    imagemMobile:
                    {
                        nome:'',
                        url:''
                    }

                    

                }
            
            

    }),

    created() {
    },
    methods:{
        previwerImageMob(payload)
        {   
            let file = payload
          
            if (this.editedItem.imagemMobile.url==''){

                this.editedItem.imagemMobile.url=window.URL.createObjectURL(file)
                 this.editedItem.imagemMobile.nome=file.name
            }

        },
        previwerimage(payload)
        {
            let file = payload
        
           if(this.editedItem.imagemDesktop.url== ''){
               this.editedItem.imagemDesktop.url=window.URL.createObjectURL(file)
               this.editedItem.imagemDesktop.nome=file.name
           }

        },
     
    }

}
</script>


<style>
  
</style>