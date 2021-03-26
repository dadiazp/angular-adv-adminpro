import { Component, Input } from '@angular/core';

import { MultiDataSet, Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent {

  @Input() title: string = "Sin titulo";

  @Input() labels: string[] = ['Default1', 'Default2', 'Default3'];

  @Input() data: any = [
    [5, 5, 5],
  ];

  public colors: Color[] = [
    {backgroundColor: ['#6857E6', '#009FEE', '#F02059']}
  ];

}
