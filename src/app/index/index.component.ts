import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {

  constructor(private router: Router) { 
    router.navigate(['/home']);
  }
  
  ngOnInit(): void {
  }

}
