import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const routes = {};

@Injectable()
export class CustomerService {
  constructor(private httpClient: HttpClient) {}
}
