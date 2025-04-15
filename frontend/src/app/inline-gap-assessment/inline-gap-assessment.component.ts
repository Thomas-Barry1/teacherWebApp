import { Component, Input } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StateService } from '../services/state.service';
import { MarkdownService } from '../services/markdown.service';
import { SafeHtml } from '@angular/platform-browser';
import { Question } from '../shared/question.model';
import { InlineGapAssessment } from '../shared/inline_gap_assessment.models';
import * as DOMPurify from 'dompurify';

@Component({
  selector: 'app-inline-gap-assessment',
  templateUrl: './inline-gap-assessment.component.html',
  styleUrls: ['./inline-gap-assessment.component.css'],
})
export class InlineGapAssessmentComponent {
  @Input() assessment: InlineGapAssessment;
  @Input() testData: { questions: Question[], testName: string, selectedAnswers: string[] } | null = null;
  performanceSummary$!: Promise<SafeHtml>;
  improvementPlan$!: Promise<SafeHtml>;
  standards!: 
  // {
  //   standard: string;
  //   strength: 'Strong' | 'Moderate' | 'Weak' | 'strong' | 'moderate' | 'weak' | null;
  //   description: string;
  // }
  any[];
  formattedTestContent: string = '';
  formattedAssessmentContent: string = '';

  constructor(private markdownService: MarkdownService) {
    // Placeholder assessment
    this.assessment = {
      overallStrength: 'Moderate',
      performanceSummary:
        'This student shows a significant discrepancy in their test performance, excelling in some areas and completely failing in others. This suggests a possible issue with understanding specific mathematical concepts rather than a general lack of mathematical ability. A plan needs to address both the strengths and weaknesses.',
      standardsPerformance: [
        {
          standard: 'K.OA.A.1',
          strength: 'Strong',
          description: 'Understanding addition and subtraction within 5',
        },
        {
          standard: '4.NF.A.1',
          strength: 'Strong',
          description: 'Understanding equivalent fractions',
        },
        {
          standard: '3.OA.A.7',
          strength: 'Strong',
          description: 'Multiplying and dividing numbers less than 100',
        },
        {
          standard: '3.MD.C.5',
          strength: 'Weak',
          description:
            'Understands concepts of area and relating area to multiplication and addition',
        },
        {
          standard: '5.0A.A.2',
          strength: 'Weak',
          description: 'Writing and interpreting numerical expressions',
        },
      ],
      improvementPlan:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    };
    // Placeholder test data
    console.log("Constructor for inline gap assessment")
  }

  async ngOnInit() {
    console.log("On init for inline gap assessment: ", this.assessment);
    console.log("On init for test data: ", this.testData);
    this.improvementPlan$ = this.convertMarkdown(this.assessment.improvementPlan);
    this.performanceSummary$ = this.convertMarkdown(this.assessment.performanceSummary);
    this.standards = this.assessment.standardsPerformance.map(
    ((standard) => {
        return {
        standard: standard.standard,
        strength: standard.strength,
        description: this.markdownService.convert(standard.description)
        }
      }))
    this.formattedTestContent = await this.formatTestContent();
    this.formattedAssessmentContent = await this.formatAssessmentContent();
    console.log("Formatted test content: ", this.formattedTestContent);
  }

  getMasteryStandards() {
    return this.standards.filter(
      (predicate) => predicate.strength === 'Strong' || predicate.strength === "strong"
    )
  }

  async convertMarkdown(bareMarkdown: string){
    console.log("Start markdown in inline gap assessment");
    return await this.markdownService.convert(bareMarkdown);
  }

  getImprovementStandards() {
    return this.standards.filter(
      (standard) =>
        standard.strength === 'Weak' || standard.strength === 'Moderate' || standard.strength === "weak" || standard.strength === "moderate"
    );
  }

  async formatTestContent(): Promise<string> {
    if (!this.testData) return '';
    
    let content = `# ${this.testData.testName}\n\n`;
    
    this.testData.questions.forEach((question, index) => {
      content += `## Question ${index + 1}\n`;
      content += `${question.question}\n\n`;
      content += `### Answer Choices:\n`;
      question.answerChoices.forEach((choice, choiceIndex) => {
        const prefix = String.fromCharCode(65 + choiceIndex); // A, B, C, etc.
        content += `${prefix}. ${choice}\n`;
      });
      content += `\n### Student's Answer: ${this.testData?.selectedAnswers[index] || 'Not answered'}\n`;
      content += `### Correct Answer: ${question.correctAnswer}\n\n`;
      content += '---\n\n';
    });

    content = await this.markdownService.convertHtml(content);

    return content;
  }

  async formatAssessmentContent(): Promise<string> {
    console.log("Start formatting assessment in inline gap assessment")
    let content = '# Gap Assessment Analysis\n\n';
    
    // // Performance Summary
    // content += '## Performance Summary\n';
    // content += await this.performanceSummary$;
    // content += '\n\n';

    // // Areas of Mastery
    // content += '## Areas of Mastery\n';
    // const masteryStandards = await this.getMasteryStandards();
    // masteryStandards.forEach(standard => {
    //   content += `### ${standard.standard}\n`;
    //   content += `${standard.description}\n\n`;
    // });

    // Areas for Improvement
    // content += '## Areas for Improvement\n';
    // const improvementStandards = await this.getImprovementStandards();
    // improvementStandards.forEach(standard => {
    //   content += `### ${standard.standard}\n`;
    //   content += `${standard.description}\n\n`;
    // });

    // Improvement Plan
    content += '## Improvement Plan\n';
    content += this.assessment.improvementPlan;
    content = await this.markdownService.convertHtml(content);
    console.log("Formatted assessment content: ", content);

    return content;
  }
}
