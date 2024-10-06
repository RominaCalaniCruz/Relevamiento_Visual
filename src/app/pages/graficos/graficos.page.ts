import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { FirebaseService } from '../../services/firebase.service';
// import { Fotos } from '../../models/fotos.model';
import { NavController } from '@ionic/angular';
import {
  Chart,
  BarElement,
  BarController,
  CategoryScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  LinearScale,
  registerables,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
// Chart.register(...registerables);

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.page.html',
  styleUrls: ['./graficos.page.scss'],
})
export class GraficosPage implements OnInit {
  pieChart: any;
  pipeChart: Chart;
  viewPipeChart: boolean;
  // @ViewChild('graficoTorta', { static: true }) graficoTorta: ElementRef;
  barChart: any;
  opcionSeleccionada: string = 'lindo';
  fotos: any[] = [];
  filteredPhotos: any[] = [];
  utilsSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);
  idUser: string;
  isLoading = true;
  hayFotosLindas = false;
  hayFotosFeas = false;

  constructor(private navCtrl: NavController) {
    this.idUser = this.utilsSvc.getLocalStorage('user').id;
    Chart.register(
      BarElement,
      BarController,
      CategoryScale,
      Decimation,
      Filler,
      Legend,
      Title,
      Tooltip,
      LinearScale,
      ChartDataLabels
    );

    Chart.register(...registerables);
  }

  ngOnInit() {
    this.getAllFotos(this.opcionSeleccionada);
  }
  segmentChanged(event: any) {
    console.log(event?.target.value);
    this.opcionSeleccionada = event.target.value;
    this.getAllFotos(this.opcionSeleccionada);
    // if (this.opcionSeleccionada == 'lindo') {
    //   this.hayFotosLindas = true;
    //   this.hayFotosFeas = false;
    // }
    // else if (this.opcionSeleccionada == 'feo') {
    //   this.hayFotosFeas = true;
    //   this.hayFotosLindas = true;
    // }
  }


  goBack() {
    this.navCtrl.back();
  }
  onImageLoad(photo: any) {
    photo.loading = false; // Detiene el spinner
    photo.imageLoaded = true; // Marca la imagen como cargada

    console.log("se cargo");
  }

  async getAllFotos(tipo: string) {
    const loading = await this.utilsSvc.loading();
    await loading.present();
    this.firebaseSvc.getColleciondeTodasFotos(tipo).subscribe((res) => {
      this.fotos = res.filter(photo => photo.cantLikes > 0); //Se lo asigno al mi lista de fotos
      if (this.fotos.length && this.opcionSeleccionada == 'lindo') {
        this.generarGraficoTorta();
        this.hayFotosLindas = true;
        console.log("genero torta")

      }
      else if (this.fotos.length && this.opcionSeleccionada == 'feo') {
        this.hayFotosFeas = true;
        this.generarGraficoBarras();
        console.log("genero barras")

      }

      console.log(this.fotos);
      // this.filterPhotos('lindo');
      loading.dismiss();

    });
  }

  generarGraficoBarras() {
    const labels = this.fotos.map(photo => photo.autor);
    const likes = this.fotos.map(photo => photo.cantLikes);
    const maxDataValue = Math.max(...likes);
    const suggestedMaxValue = maxDataValue + 2;
    const images = this.fotos.map((p) => {
      const image = new Image(150, 150);
      image.src = p.url;
      return image;
    });

    this.barChart = new Chart('graficoBarras', {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data: likes,
          backgroundColor: [
            'rgba(120, 238, 82, 0.2)',
            'rgba(14, 180, 142, 0.5)',
            'rgba(237, 243, 61, 0.6)',
            'rgba(166, 12, 169, 0.6)',
            'rgba(238, 42, 57, 0.8)',
            'rgba(238, 158, 42, 0.9)',
            'rgba(255, 99, 132, 1)'
          ]
        }]
      },
      options: {
        maintainAspectRatio: false, // Permite ajustar las dimensiones del gráfico
        aspectRatio: 3,
        responsive: true,
        scales: {
          y: {
            max: suggestedMaxValue,
            ticks: {
              stepSize: 1
            }
          }
        },
        plugins: {
          datalabels: {
            color: 'black',
            anchor: 'end',
            align: 'top',
            font: {
              size: 19,
              weight: 'bold'
            },
            formatter: (value, context) => {
              return value;
            }
          },
          tooltip: {
            enabled: false,
            external: context => {
              const tooltipEl = document.getElementById('chartjs-tooltip1');
              const tooltipImg = document.getElementById('tooltip-img1') as HTMLImageElement;
              const tooltipText = document.getElementById('tooltip-text1');

              // Create element on first render
              if (!tooltipEl) {
                const tooltip = document.createElement('div');
                tooltip.id = 'chartjs-tooltip1';
                tooltip.style.opacity = '0';
                tooltip.style.position = 'absolute';
                tooltip.style.pointerEvents = 'none';
                tooltip.style.transition = 'all .1s ease';

                const img = document.createElement('img');
                img.id = 'tooltip-img1';
                img.style.width = '120px';
                img.style.height = '120px';
                img.style.display = 'block';
                // img.style.margin = '0 auto';
                tooltip.appendChild(img);

                const text = document.createElement('div');
                text.id = 'tooltip-text1';
                text.style.textAlign = 'center';
                text.style.color = '#fff';
                text.style.fontSize = '14px';
                tooltip.appendChild(text);

                document.body.appendChild(tooltip);
              }

              const { chart, tooltip: chartTooltip } = context;
              if (chartTooltip.opacity === 0) {
                tooltipEl.style.opacity = '0';
                return;
              }

              if (chartTooltip.body) {
                const { dataIndex } = chartTooltip.dataPoints[0];

                // Clean the tooltip image source to avoid the flicker
                tooltipImg.src = '';

                tooltipImg.src = images[dataIndex].src;
                tooltipText.innerHTML = `Cantidad de votos: ${chartTooltip.dataPoints[0].formattedValue}`;

                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;

                // // Calcular la posición central del tooltip
                // const tooltipWidth = tooltipEl.offsetWidth;
                // const tooltipHeight = tooltipEl.offsetHeight;
                // const leftPosition = (windowWidth - tooltipWidth) / 2;
                // const topPosition = (windowHeight - tooltipHeight) / 2;

                // // Aplicar la posición central al tooltip
                // tooltipEl.style.opacity = '1';
                // tooltipEl.style.left = `${leftPosition}px`;
                // tooltipEl.style.top = `${topPosition}px`;

                const position = chart.canvas.getBoundingClientRect();
                tooltipEl.style.opacity = '1';
                tooltipEl.style.left = `${position.left + window.screenX + chartTooltip.caretX - 30}px`;
                tooltipEl.style.top = `${position.top + window.scrollY + chartTooltip.caretY - 30}px`;
                tooltipEl.style.transform = 'translate(-50%, -210%)';
              }
            }
          },
          legend: {
            display: false
          }
        }
      }
    });

  }
  generarGraficoTorta() {
    const labels = this.fotos.map(photo => photo.autor);
    const likes = this.fotos.map(photo => photo.cantLikes);
    const images = this.fotos.map((p) => {
      const image = new Image(150, 150);
      image.src = p.url;
      return image;
    });
    this.pieChart = new Chart('graficoTorta', {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data: likes,
          backgroundColor: [
            'rgba(120, 238, 82, 0.2)',
            'rgba(14, 180, 142, 0.5)',
            'rgba(237, 243, 61, 0.6)',
            'rgba(166, 12, 169, 0.6)',
            'rgba(238, 42, 57, 0.8)',
            'rgba(238, 158, 42, 0.9)',
            'rgba(255, 99, 132, 1)'
          ],
          borderColor: '#D66F8E' 
        }]
      },
      options: {
        responsive: true,
        layout: {
          padding: 20
        },

        plugins: {
          datalabels: {
            color: 'black',
            anchor: 'center',
            align: 'center',
            font: {
              size: 25,
              weight: 'bold'
            },
            formatter: (value, context) => {
              return value;
            }
          },
          tooltip: {
            enabled: false,
            external: context => {
              const tooltipEl = document.getElementById('chartjs-tooltip');
              const tooltipImg = document.getElementById('tooltip-img') as HTMLImageElement;
              const tooltipText = document.getElementById('tooltip-text');
              // Create element on first render
              if (!tooltipEl) {
                const tooltip = document.createElement('div');
                tooltip.id = 'chartjs-tooltip';
                tooltip.style.opacity = '0';
                tooltip.style.position = 'absolute';
                tooltip.style.pointerEvents = 'none';
                tooltip.style.transition = 'all .1s ease';

                const img = document.createElement('img');
                img.id = 'tooltip-img';
                img.style.width = '100px';
                img.style.height = '100px';
                img.style.display = 'block';
                img.style.margin = '0 auto';
                tooltip.appendChild(img);

                const text = document.createElement('div');
                text.id = 'tooltip-text';
                text.style.textAlign = 'center';
                text.style.color = '#fff';
                text.style.fontSize = '14px';
                tooltip.appendChild(text);

                document.body.appendChild(tooltip);
              }

              // Display, position, and set styles for font
              const { chart, tooltip: chartTooltip } = context;
              if (chartTooltip.opacity === 0) {
                tooltipEl.style.opacity = '0';
                return;
              }

              if (chartTooltip.body) {
                const { dataIndex } = chartTooltip.dataPoints[0];
                tooltipImg.src = '';
                tooltipImg.src = images[dataIndex].src;
                tooltipText.innerHTML = `Cantidad de votos: ${chartTooltip.dataPoints[0].formattedValue}`;

                const position = chart.canvas.getBoundingClientRect();
                tooltipEl.style.opacity = '1';
                tooltipEl.style.left = `${position.left + window.pageXOffset + chartTooltip.caretX}px`;
                tooltipEl.style.top = `${position.top + window.pageYOffset + chartTooltip.caretY}px`;
                tooltipEl.style.transform = 'translate(-50%, 0)';
              }
            }
          },
          legend: {
            display: false
          }
        }
      }
    });

  }

  async traerFeos() {
    const loading = await this.utilsSvc.loading();
    await loading.present();
    this.firebaseSvc.getColleciondeTodasFotos('feo').subscribe((res: any[]) => {
      this.fotos = res.map((photo: any) => ({
        ...photo,
        loading: true,
        imageLoaded: false
      }));
      console.log(this.fotos);
      // this.filterPhotos('lindo');
      loading.dismiss();
    });
    // loading.dismiss();
  }

}
