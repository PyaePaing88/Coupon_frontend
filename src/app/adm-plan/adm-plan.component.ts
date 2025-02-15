import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlanService } from '../Services/plan.service';
import { ToastrService } from 'ngx-toastr';
import { Plan } from '../models/plan';

@Component({
  selector: 'app-adm-plan',
  templateUrl: './adm-plan.component.html',
  styleUrls: ['./adm-plan.component.css'],
})
export class AdmPlanComponent {
  isSidebarCollapsed = false;
  title: any;

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  isModalVisible: boolean = false;

  toggleModal() {
    this.isModalVisible = !this.isModalVisible; // Toggle visibility on/off
  }

  planForm!: FormGroup;
  plans: Plan[] = [];

  constructor(
    private fb: FormBuilder,
    private planService: PlanService,
    private toastaService: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadPlans();
    this.planForm = this.fb.group({
      name: ['', [Validators.required]],
      max_packages: [0, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(1)]],
    });
  }

  onSubmit(): void {
    if (this.planForm.valid) {
      const planData: Plan = this.planForm.value;

      this.planService.createPlan(planData).subscribe(
        (response) => {
          this.toastaService.success('Plan created successfully!');
          this.planForm.reset();
          this.toggleModal();
          this.loadPlans();
        },
        (error) => {
          this.toastaService.error('Failed to create plan.');
        }
      );
    } else {
      this.toastaService.error('Please fill out the form correctly.');
    }
  }

  loadPlans(): void {
    this.planService.getAllPlans().subscribe(
      (data) => {
        this.plans = data;
      },
      (error) => {
        console.error('Error loading plans:', error);
      }
    );
  }
}
