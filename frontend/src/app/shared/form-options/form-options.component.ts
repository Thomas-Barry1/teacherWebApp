import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppConstants } from 'src/app/app.constants';

@Component({
  selector: 'app-form-options',
  // standalone: true,
  // imports: [MatFormFieldModule],
  templateUrl: './form-options.component.html',
  styleUrl: './form-options.component.css'
})
export class FormOptionsComponent {
  @Input()
  parentFormGroup!: FormGroup;

  // Define inputs to control visibility
  @Input() showNumberOfQuestions: boolean = true;
  @Input() showGradeLevel: boolean = true;
  @Input() showCommonCoreStandards: boolean = true;
  @Input() showSkills: boolean = true;
  @Input() showQuestionTypes: boolean = false;
  @Input() showState: boolean = true;


  questionTypes: string[] = ['Multiple Choice', 'True/False', 'Short Answer', 'Long Answer', 'Reading Passage', 'Bonus Question'];
  gradeLevels : string[] = ['Preschool', 'Kindergarden', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', 'College', 'Graduate School']

  stateSearch = '';
  // Filtered list of states for search
  filteredStates = [...this.constants.stateList];
  selectedStateAbbreviation = '';

  constructor(private constants: AppConstants){}

  // Updates the selected state abbreviation
  onStateChange(event: any) {
    this.selectedStateAbbreviation = event.value;
    console.log('Selected Abbreviation:', event.value);

    // Find and set the full state name before sending to the backend
    const selectedState = this.constants.stateList.find(
      (state) => state.abbreviation === event.value
    );
    if (selectedState) {
      console.log('Sending to backend:', selectedState.name);
    }
  }

  // Filters the state list based on search input
  filterStates() {
    this.filteredStates = this.constants.stateList.filter((state) =>
      state.abbreviation.toLowerCase().includes(this.stateSearch.toLowerCase())
    );
  }
}
