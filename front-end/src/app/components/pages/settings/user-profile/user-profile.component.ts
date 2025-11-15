import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  displayName = '';
  bio = '';
  loading = true;


  profileImageUrl = '../../../../../assets/images/icons/profile.svg'; // default image
  selectedImageFile: File | null = null;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadProfile();
  }

  // Carga de datos
  loadProfile() {
  this.loading = true;
    this.userService.getProfile().subscribe({
      next: (user) => {
        console.log('Profile from backend:', user);
        this.displayName = user.displayName;
        this.bio = user.bio;
        this.profileImageUrl = user.profileImage || '../../../../../assets/images/icons/profile.svg';
        this.loading = false;
      },
      error: (err) => {
        console.log('Error fetching profile:', err);
        this.loading = false;
      }
    });
  }


  // Envio de datos al backend
saveProfile() {
  const formData = new FormData();
  formData.append('displayName', this.displayName);
  formData.append('bio', this.bio);

  if (this.selectedImageFile) {
    formData.append('profileImage', this.selectedImageFile);
  }

  this.userService.updateProfileFormData(formData).subscribe({
    next: () => alert('Profile updated successfully'),
    error: (err) => console.log('There was a problem updating your profile', err)
  });
}


  // Profiele pic
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if(!file) return;

    this.selectedImageFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.profileImageUrl = reader.result as string;
    };

    reader.readAsDataURL(file);
  }
}
