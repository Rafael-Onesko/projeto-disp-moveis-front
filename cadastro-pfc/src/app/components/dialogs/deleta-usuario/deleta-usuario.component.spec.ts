import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletaUsuarioComponent } from './deleta-usuario.component';

describe('DeletaUsuarioComponent', () => {
  let component: DeletaUsuarioComponent;
  let fixture: ComponentFixture<DeletaUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletaUsuarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletaUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
