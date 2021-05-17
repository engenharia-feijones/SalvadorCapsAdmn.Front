<template>
     <v-card>
              <v-card-title>
                <span class="headline">Nova Marca</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row justify="center" align="center">
                    <v-col class="mb-0 pb-0" cols="12" sm="6" md="12">
                      <v-text-field v-model="brand.name" label="Nome">
                      </v-text-field>
                    </v-col>

                    <v-col class="mb-0 ml-2">
                      <v-row align="center">
                        <v-checkbox value></v-checkbox>
                        <p class="mt-4">Promocional</p>
                      </v-row>
                    </v-col>

                    <!-- START UPLOAD IMG DESKTOP -->

                    <v-col cols="12" sm="6" md="12" lg="12">
                      <v-card style="background: #0b7ad1">
                        <v-btn small fab class="mb-2 mt-2 ml-2 txtBtn">
                          <v-file-input
                            @change="previwerimage"
                            class="ml-2 mb-2"
                            prepend-icon="mdi-remote-desktop"
                            filled
                            hide-input
                          >
                          </v-file-input>
                        </v-btn>
                        <label style="color: white" class="ml-4"
                          >Imagem Desktop</label
                        >
                      </v-card>
                      <v-card height="auto" class="mt-3" elevation="1">
                        <v-row class="ml-4" justify="start">
                          <v-col cols="3">
                            <v-card elevation="0">
                              <v-img
                                class="mt-2"
                                max-height="70px"
                                max-width="70px"
                                :src="brand.desktopSpotlightImage"
                              ></v-img>
                            </v-card>
                          </v-col>
                          <v-col align="start" cols="6">
                            <p
                              style="font-size: 10px"
                              v-if="brand.name"
                            >
                              {{ brand.desktopSpotlightImage }}
                            </p>
                          </v-col>
                          <v-col class="btnX" align="end" cols="1">
                            <v-btn
                              v-if="brand.desktopSpotlightImage"
                              text
                              fab
                              small
                            >
                              <v-icon small>mdi-delete</v-icon>
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-col>

                    <!-- END UPLOAD IMG DESKTOP -->

                    <!-- STARTP UPLOAD IMG MOBILE -->

                    <v-col cols="12" sm="6" md="12" lg="12">
                      <v-card style="background: #0b7ad1">
                        <v-btn small fab class="mb-2 mt-2 ml-2 txtBtn">
                          <v-file-input
                            @change="previwerImageMob"
                            class="ml-2 mb-2"
                            prepend-icon="mdi-cellphone"
                            filled
                            hide-input
                          >
                          </v-file-input>
                        </v-btn>
                        <label style="color: white" class="ml-4"
                          >Imagem Mobile</label
                        >
                      </v-card>
                      <v-card class="mt-3">
                        <v-row class="ml-4" justify="start">
                          <v-col cols="3">
                            <v-card elevation="0">
                              <v-img
                                class="mt-2"
                                max-height="70"
                                max-width="70"
                                :src="brand.mobileSpotlightImage"
                              ></v-img>
                            </v-card>
                          </v-col>
                          <v-col align="start" cols="6">
                            <p
                              class="mt-2"
                              style="font-size: 10px; width: 100px"
                              v-if="brand.name"
                            >
                              {{ brand.mobileSpotlightImage}}
                            </p>
                          </v-col>
                          <v-col class="btnX" align="end" cols="1">
                            <v-btn
                              v-if="brand.mobileSpotlightImage"
                              text
                              fab
                              small
                            >
                              <v-icon small>mdi-delete</v-icon>
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-col>
                    <!-- END UPLOAD IMG MOBILE -->

                    <v-col>
                      <v-row justify="end">
                        <v-btn text> save</v-btn>
                        <v-btn text> Cancel</v-btn>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
</template>