import { Injectable } from '@angular/core';
import { Plan } from '../models/plan';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BusinessPlan } from '../models/business-plan';

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  private apiUrl = environment.apiUrl; // Replace with your backend endpoint

  constructor(private http: HttpClient) {}

  createPlan(plan: Plan): Observable<Plan> {
    return this.http.post<Plan>(`${this.apiUrl}plans/save`, plan);
  }

  getAllPlans(): Observable<Plan[]> {
    return this.http.get<Plan[]>(`${this.apiUrl}plans/getAll`);
  }

  saveBusinessPlan(businessPlan: BusinessPlan): Observable<BusinessPlan> {
    return this.http.post<BusinessPlan>(
      `${this.apiUrl}business-plan/save`,
      businessPlan
    );
  }

  getBusinessPlanByBusinessId(businessId: number): Observable<BusinessPlan> {
    return this.http.get<BusinessPlan>(
      `${this.apiUrl}business-plan/public/by-business/${businessId}`
    );
  }
}
