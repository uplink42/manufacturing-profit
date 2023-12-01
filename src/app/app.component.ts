import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MarketService } from './market.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'profit-tracker';

  market = inject(MarketService);

  itemsWithPrice$ = this.market.itemsWithRecipe;

  ngOnInit() {
    this.market.getCraftableItems();
  }
}
