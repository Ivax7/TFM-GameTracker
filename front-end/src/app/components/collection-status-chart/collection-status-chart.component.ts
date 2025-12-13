import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  ViewChild, 
  ElementRef, 
  OnChanges, 
  SimpleChanges, 
  AfterViewInit 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as echarts from 'echarts';

@Component({
  selector: 'app-collection-status-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collection-status-chart.component.html',
  styleUrls: ['./collection-status-chart.component.css']
})
export class CollectionStatusChartComponent implements AfterViewInit, OnChanges {

  @Input() counts!: Record<string, number>;
  @Output() statusSelected = new EventEmitter<string>();

  @ViewChild('chart', { static: true })
  chartRef!: ElementRef<HTMLDivElement>;

  private chart!: echarts.ECharts;

  ngAfterViewInit() {
    this.chart = echarts.init(this.chartRef.nativeElement);
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['counts'] && this.chart) {
      this.updateChart();
    }
  }

  private updateChart() {
    if (!this.counts) return;

    const data = Object.entries(this.counts)
      .map(([name, value]) => ({ name, value }));

    if (!data.length) return;

    const option: echarts.EChartsOption = {
      tooltip: { trigger: 'item' },
      legend: { bottom: 0, textStyle: { color: '#fff' } },
      series: [
        {
          name: 'Game status',
          type: 'pie',
          radius: ['45%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 6, borderColor: '#111', borderWidth: 2 },
          label: { show: false },
          emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold' } },
          data
        }
      ]
    };

    this.chart.setOption(option);

    this.chart.off('click');
    this.chart.on('click', params => {
      this.statusSelected.emit(params.name as string);
    });
  }
}
