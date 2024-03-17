import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { ReservationService } from '../reservation/reservation.service';
import { Reservation } from '../models/reservation';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css'],
})
export class ReservationFormComponent implements OnInit {
  reservationFrom: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    private reservationSrv: ReservationService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.reservationFrom = this.formBuilder.group({
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
      guestName: ['', Validators.required],
      guestEmail: ['', [Validators.required, Validators.email]],
      roomNumber: ['', Validators.required],
    });

    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      let reservation = this.reservationSrv.getReservation(id);
      if (reservation) this.reservationFrom.patchValue(reservation);
    }
  }

  onSubmit() {
    if (this.reservationFrom.valid) {
      let reservation: Reservation = this.reservationFrom.value;
      let id = this.activatedRoute.snapshot.paramMap.get('id');
      if (id) {
        this.reservationSrv.updateReservation(id, reservation);
      } else {
        this.reservationSrv.addReservation(reservation);
      }
      this.router.navigate(['/list']);
    }
  }
}
