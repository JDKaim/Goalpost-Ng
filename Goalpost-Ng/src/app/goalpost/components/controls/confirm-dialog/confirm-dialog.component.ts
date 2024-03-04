import { Component, ElementRef, Input, TemplateRef } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { ConfirmDialogModule } from "primeng/confirmdialog";

@Component({
  standalone: true,
  selector: "confirm-dialog",
  templateUrl: "./confirm-dialog.component.html",
  imports: [ConfirmDialogModule, ButtonModule],
})
export class ConfirmDialogComponent {
    @Input() confirmText = "Confirm";
    @Input() confirmStyleClass = "p-button-success";
    @Input() rejectText = "Cancel";
    @Input() rejectStyleClass = "p-button-secondary";
    @Input() key = "";
    @Input() appendTo?: HTMLElement | ElementRef | TemplateRef<any> | string | null | undefined | any;
}
