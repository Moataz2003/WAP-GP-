import Toastify from 'toastify-js';
import { Component, NgZone, OnInit } from '@angular/core';
import { SdxlService } from '../services/sdxl.service';
import { ImgData } from '../models/image-data';
import { ImagesService } from '../services/images.service';
import { Router } from '@angular/router';
import { FaviconService } from '../services/favicon.service';
import { AccountService } from '../services/account.service';
import { BrandValidatorService } from '../services/brand-validator.service';

@Component({
  selector: 'app-generate-image',
  templateUrl: './generate-image.component.html',
  styleUrls: ['./generate-image.component.css']
})
export class GenerateImageComponent implements OnInit {
  step = 1;
  len = 6;
  progress = 0;
  prompt: string = '';
  brandName: string = '';
  brandStyle: string = '';
  isLoading: boolean = false;
  images: any[] | null = null;
  isModalOpen: boolean = false;
  imageData: ImgData[] | null = null;
  generatedImage: ImgData | null = null;
  modalOpen: boolean = false;
  currentImages: string[] = [];
  currentStyle: string = '';
  isListeningStyle = false;
  isListeningPrompt = false;
  isRecognitionSupported: boolean = false;
  private isListening: boolean = false;
  isProcessing: boolean = false;
  error: string | null = null;
  currentLanguage: 'en' | 'ar' = 'en';
  textDirection: 'ltr' | 'rtl' = 'ltr';

  private recognition: any;
  private recognitionTimeout: any;
  private maxRetries = 3;
  private currentRetry = 0;
  private retryDelay = 1000; // 1 second
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private silenceTimeout: any;
  private audioDetected: boolean = false;

  styles: { name: string, image: string }[] = [
    { name: '3D & Geometric', image: './../../assets/3d-geometric/3d-geometric.jpg' },
    { name: 'Anime-Inspired & Cel-Shaded', image: './../../assets/Anime-Inspired&Cel-Shaded/anime.jpg'},
    { name: 'Art Movement-Inspired', image: './../../assets/art-movement/art-movement.jpg' },
    { name: 'Baroque & Dramatic', image: './../../assets/Baroque&Dramatic/Baroque-Dramatic.jpg' },
    { name: 'Classic & Historical', image: './../../assets/Classic-Historical/classic-historical.jpg' },
    { name: 'Color & Light-Based', image: './../../assets/Color-Light-Based/color-light.jpg' },
    { name: 'Dark & Mysterious', image: './../../assets/dark-mysterious/dark-mysterious.jpg' },
    { name: 'Decorative & Handcrafted', image: './../../assets/Decorative-Handcrafted/decorative-handcrafted.jpg' },
    { name: 'Dynamic & Playful', image: './../../assets/Dynamic-Playful/dynamic-playful.jpg' },
    { name: 'Experimental & Futuristic Fantasy', image: './../../assets/Experimental-Futuristic-Fantasy/futuristic-fantasy.jpg' },
    { name: 'Futuristic & Tech', image: './../../assets/futuristic-tech/futuristic-tech.jpg' },
    { name: 'Hyperrealistic & Photographic', image: './../../assets/Hyperrealistic&Photographic/Hyperrealistic-Photographic.png' },
    { name: 'Industrial & Mechanical', image: './../../assets/Industrial-Mechanical/industrial-mechanical.jpg' },
    { name: 'Luxurious & Ornamental', image: './../../assets/Luxurious/Luxurious.jpg' },
    { name: 'Modern', image: './../../assets/modern/modern.jpg' },
    { name: 'Organic & Natural', image: './../../assets/Organic-Natural/organic-natural.jpg' },
    { name: 'Sci-Fi & Space-Inspired', image: './../../assets/Space-Inspired/scifi-space.jpg' },
    { name: 'Textural & Experimental Visual Effects', image: './../../assets/Textural/textural-effects.jpg' },
    { name: 'Vintage & Retro', image: './../../assets/Vintage-Retro/vintage-retro.jpg' },
  ];


  styleImages: { [key: string]: string[] } = {
    'Anime-Inspired & Cel-Shaded': [
      './../../assets/Anime-Inspired-Cel-Shaded/anime-1.jpg',
      './../../assets/Anime-Inspired-Cel-Shaded/anime-2.jpg',
      './../../assets/Anime-Inspired-Cel-Shaded/anime-3.jpg',
      './../../assets/Anime-Inspired-Cel-Shaded/anime-4.jpg',
      './../../assets/Anime-Inspired-Cel-Shaded/anime-5.jpg'
    ],
    'Dark & Mysterious': [
      './../../assets/dark-mysterious/dark-mysterious-1.jpg',
      './../../assets/dark-mysterious/dark-mysterious-2.jpg',
      './../../assets/dark-mysterious/dark-mysterious-3.jpg',
      './../../assets/dark-mysterious/dark-mysterious-4.jpg',
      './../../assets/dark-mysterious/dark-mysterious-5.jpg'
    ],
    'Futuristic & Tech': [
      './../../assets/futuristic-tech/futuristic-tech-1.jpg',
      './../../assets/futuristic-tech/futuristic-tech-2.jpg',
      './../../assets/futuristic-tech/futuristic-tech-3.jpg',
      './../../assets/futuristic-tech/futuristic-tech-4.jpg',
      './../../assets/futuristic-tech/futuristic-tech-5.jpg'
    ],
    'Modern': [
      './../../assets/modern/modern-1.jpg',
      './../../assets/modern/modern-2.jpg',
      './../../assets/modern/modern-3.jpg',
      './../../assets/modern/modern-4.jpg',
      './../../assets/modern/modern-5.jpg'
    ],
    'Art Movement-Inspired': [
      './../../assets/art-movement/art-movement-1.jpg',
      './../../assets/art-movement/art-movement-2.jpg',
      './../../assets/art-movement/art-movement-3.jpg',
      './../../assets/art-movement/art-movement-4.jpg',
      './../../assets/art-movement/art-movement-5.jpg'
    ],
    'Luxurious & Ornamental': [
      './../../assets/Luxurious/luxurious-1.jpg',
      './../../assets/Luxurious/luxurious-2.jpg',
      './../../assets/Luxurious/luxurious-3.jpg',
      './../../assets/Luxurious/luxurious-4.jpg',
      './../../assets/Luxurious/luxurious-5.jpg'
    ],
    'Classic & Historical': [
      './../../assets/Classic-Historical/Classic-Historical-1.jpg',
      './../../assets/Classic-Historical/Classic-Historical-2.jpg',
      './../../assets/Classic-Historical/Classic-Historical-3.jpg',
      './../../assets/Classic-Historical/Classic-Historical-4.jpg',
      './../../assets/Classic-Historical/Classic-Historical-5.jpg'
    ],
    'Experimental & Futuristic Fantasy': [
      './../../assets/Experimental-Futuristic-Fantasy/futuristic-fantasy-1.jpg',
      './../../assets/Experimental-Futuristic-Fantasy/futuristic-fantasy-2.jpg',
      './../../assets/Experimental-Futuristic-Fantasy/futuristic-fantasy-3.jpg',
      './../../assets/Experimental-Futuristic-Fantasy/futuristic-fantasy-4.jpg',
      './../../assets/Experimental-Futuristic-Fantasy/futuristic-fantasy-5.jpg'
    ],
    'Color & Light-Based': [
      './../../assets/Color-Light-Based/color-light-1.jpg',
      './../../assets/Color-Light-Based/color-light-2.jpg',
      './../../assets/Color-Light-Based/color-light-3.jpg',
      './../../assets/Color-Light-Based/color-light-4.jpg',
      './../../assets/Color-Light-Based/color-light-5.jpg'
    ],
    '3D & Geometric': [
      './../../assets/3d-geometric/3d-geometric-1.jpg',
      './../../assets/3d-geometric/3d-geometric-2.jpg',
      './../../assets/3d-geometric/3d-geometric-3.jpg',
      './../../assets/3d-geometric/3d-geometric-4.jpg',
      './../../assets/3d-geometric/3d-geometric-5.jpg'
    ],
    'Decorative & Handcrafted': [
      './../../assets/Decorative-Handcrafted/decorative-handcrafted-1.jpg',
      './../../assets/Decorative-Handcrafted/decorative-handcrafted-2.jpg',
      './../../assets/Decorative-Handcrafted/decorative-handcrafted-3.jpg',
      './../../assets/Decorative-Handcrafted/decorative-handcrafted-4.jpg',
      './../../assets/Decorative-Handcrafted/decorative-handcrafted-5.jpg'
    ],
    'Textural & Experimental Visual Effects': [
      './../../assets/Textural/textural-effects-1.jpg',
      './../../assets/Textural/textural-effects-2.jpg',
      './../../assets/Textural/textural-effects-3.jpg',
      './../../assets/Textural/textural-effects-4.jpg',
      './../../assets/Textural/textural-effects-5.jpg'
    ],
    'Dynamic & Playful': [
      './../../assets/Dynamic-Playful/dynamic-playful-1.jpg',
      './../../assets/Dynamic-Playful/dynamic-playful-2.jpg',
      './../../assets/Dynamic-Playful/dynamic-playful-3.jpg',
      './../../assets/Dynamic-Playful/dynamic-playful-4.jpg',
      './../../assets/Dynamic-Playful/dynamic-playful-5.jpg'
    ],
    'Vintage & Retro': [
      './../../assets/Vintage-Retro/vintage-retro-1.jpg',
      './../../assets/Vintage-Retro/vintage-retro-2.jpg',
      './../../assets/Vintage-Retro/vintage-retro-3.jpg',
      './../../assets/Vintage-Retro/vintage-retro-4.jpg',
      './../../assets/Vintage-Retro/vintage-retro-5.jpg'
    ],
    'Organic & Natural': [
      './../../assets/Organic-Natural/organic-natural-1.jpg',
      './../../assets/Organic-Natural/organic-natural-2.jpg',
      './../../assets/Organic-Natural/organic-natural-3.jpg',
      './../../assets/Organic-Natural/organic-natural-4.jpg',
      './../../assets/Organic-Natural/organic-natural-5.jpg'
    ],
    'Industrial & Mechanical': [
      './../../assets/Industrial-Mechanical/industrial-mechanical-1.jpg',
      './../../assets/Industrial-Mechanical/industrial-mechanical-2.jpg',
      './../../assets/Industrial-Mechanical/industrial-mechanical-3.jpg',
      './../../assets/Industrial-Mechanical/industrial-mechanical-4.jpg',
      './../../assets/Industrial-Mechanical/industrial-mechanical-5.jpg'
    ],
    'Sci-Fi & Space-Inspired': [
      './../../assets/Space-Inspired/scifi-space-1.jpg',
      './../../assets/Space-Inspired/scifi-space-2.jpg',
      './../../assets/Space-Inspired/scifi-space-3.jpg',
      './../../assets/Space-Inspired/scifi-space-4.jpg',
      './../../assets/Space-Inspired/scifi-space-5.jpg'
    ],
    'Baroque & Dramatic': [
      './../../assets/Baroque&Dramatic/Baroque-Dramatic-1.jpg',
      './../../assets/Baroque&Dramatic/Baroque-Dramatic-2.jpg',
      './../../assets/Baroque&Dramatic/Baroque-Dramatic-3.jpg',
      './../../assets/Baroque&Dramatic/Baroque-Dramatic-4.jpg',
      './../../assets/Baroque&Dramatic/Baroque-Dramatic-5.jpg'
    ],
    'Hyperrealistic & Photographic': [
      './../../assets/Hyperrealistic&Photographic/Hyperrealistic-Photographic-1.jpg',
      './../../assets/Hyperrealistic&Photographic/Hyperrealistic-Photographic-2.jpg',
      './../../assets/Hyperrealistic&Photographic/Hyperrealistic-Photographic-3.jpg',
      './../../assets/Hyperrealistic&Photographic/Hyperrealistic-Photographic-4.jpg',
      './../../assets/Hyperrealistic&Photographic/Hyperrealistic-Photographic-5.jpg'
    ]


  };

  constructor(
    private sdxlService: SdxlService,
    private imagesService: ImagesService,
    private ngZone: NgZone,
    private router: Router,
    private faviconService: FaviconService,
    private accountService: AccountService,
    private brandValidator: BrandValidatorService
  ) {
    this.initializeSpeechRecognition();

    // Initialize styleImages dynamically
    this.styles.forEach(style => {
      this.styleImages[style.name] = Array.from({ length: this.len }, (_, i) =>
        `${style.image.replace(/\.jpg|\.png$/, '')}-${i + 1}.jpg`
      );
    });
  }

  ngOnInit() {
    // Always start from step 1 and clear previous state
    this.step = 1;
    this.prompt = '';
    this.brandName = '';
    this.brandStyle = '';
    this.generatedImage = null;
    this.imageData = [];

    // Clear any saved state in localStorage
    localStorage.removeItem('generateImageState');
  }

  setStep(step: number) {
    this.step = step;
    this.saveCurrentState();
  }

  private saveCurrentState() {
    const currentUserId = this.accountService.getUserId();
    if (!currentUserId) {
      return; // Don't save state if no user is logged in
    }

    const state = {
      userId: currentUserId,
      step: this.step,
      prompt: this.prompt,
      brandName: this.brandName,
      brandStyle: this.brandStyle,
      generatedImage: this.generatedImage,
      imageData: this.imageData
    };
    localStorage.setItem('generateImageState', JSON.stringify(state));
  }

  onPromptChange(event: any) {
    this.prompt = event.target.value;
    this.saveCurrentState();
  }

  onBrandNameChange(event: any) {
    this.brandName = event.target.value;
    const validation = this.brandValidator.validateBrandName(this.brandName);
    if (!validation.isValid) {
      this.showToast(validation.message, 'warning');
    }
    this.saveCurrentState();
  }

  selectStyle(style: string) {
    this.brandStyle = style;
    this.saveCurrentState();
  }

  generateImage() {
    // Sanitize and trim the prompt
    let sanitizedPrompt = (this.prompt || '').replace(/[\u0000-\u001F\u007F-\u009F]/g, '').trim();
    const maxPromptLength = 512;
    if (sanitizedPrompt.length > maxPromptLength) {
      sanitizedPrompt = sanitizedPrompt.substring(0, maxPromptLength);
      this.showToast(`Prompt too long. Truncated to ${maxPromptLength} characters.`, 'warning');
    }
    if (!sanitizedPrompt || !this.brandName) {
      this.showToast('Please enter a valid prompt and brand name.', 'warning');
      return;
    }

    // Clear current image but keep the form data
    this.generatedImage = null;
    this.imageData = [];
    this.error = null; // Clear error state before starting

    this.step = 4;
    this.isLoading = true;
    this.faviconService.setLoadingFavicon();

    this.sdxlService.generateImage(this.brandName, this.brandStyle, sanitizedPrompt).subscribe({
      next: (response) => {
        this.imageData = response.images.map((img: any) => ({
          id: img.imageId,
          userId: img.userId,
          prompt: img.prompt,
          brandStyle: img.brandStyle,
          brandName: img.brandName,
          image: `data:${img.imageData.contentType};base64,${img.imageData.fileContents}`,
          isFavorite: img.isFavorite
        }));

        if (this.imageData && this.imageData.length > 0) {
          this.generatedImage = this.imageData[0];
          this.saveCurrentState();
        }
      },
      error: (error) => {
        console.error("Error generating image:", error.error.error);
        this.showToast(error.error.error);
        this.faviconService.setDefaultFavicon();
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
        this.faviconService.setDefaultFavicon();
      }
    });
  }

  regenerateImage() {
    // Keep the current form data and generate again
    if (this.prompt && this.brandName) {
      this.generateImage();
    }
  }

  startOver() {
    // Keep only the prompt and set step to brand name input
    const prompt = this.prompt;
    this.clearGeneratedImage();
    this.prompt = prompt;
    this.step = 2; // Set to brand name step
    this.saveCurrentState();
  }

  clearGeneratedImage() {
    this.generatedImage = null;
    this.imageData = [];
    this.brandName = '';
    this.brandStyle = '';
    localStorage.removeItem('generateImageState');
  }

  private initializeSpeechRecognition() {
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.setupRecognitionConfig();
        this.isRecognitionSupported = true;
      } else {
        this.handleUnsupportedBrowser();
      }
    } catch (error) {
      this.handleInitializationError(error);
    }
  }

  private async setupAudioMonitoring() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new AudioContext();
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      const analyzer = this.audioContext.createAnalyser();
      analyzer.fftSize = 256;
      source.connect(analyzer);

      const bufferLength = analyzer.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkAudioLevel = () => {
        if (!this.isListeningStyle && !this.isListeningPrompt) {
          this.stopAudioMonitoring();
          return;
        }

        analyzer.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / bufferLength;

        if (average > 10) { // Adjust this threshold as needed
          this.audioDetected = true;
          if (this.silenceTimeout) {
            clearTimeout(this.silenceTimeout);
            this.silenceTimeout = null;
          }
        }

        requestAnimationFrame(checkAudioLevel);
      };

      checkAudioLevel();

      // Set a timeout to check if any audio was detected
      this.silenceTimeout = setTimeout(() => {
        if (!this.audioDetected) {
          this.ngZone.run(() => {
            this.showToast('No voice detected. Please speak louder or check your microphone.', 'warning');
            this.recognition?.stop();
          });
        }
      }, 2000);

    } catch (error) {
      console.error('Error setting up audio monitoring:', error);
      this.showToast('Error accessing microphone. Please check your microphone settings.', 'error');
    }
  }

  private stopAudioMonitoring() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    if (this.silenceTimeout) {
      clearTimeout(this.silenceTimeout);
      this.silenceTimeout = null;
    }
    this.audioDetected = false;
  }

  private setupRecognitionConfig() {
    if (!this.recognition) return;

    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = this.currentLanguage === 'en' ? 'en-US' : 'ar-SA';
    this.recognition.maxAlternatives = 1;

    let finalTranscript = '';
    let interimTranscript = '';

    // Setup event handlers
    this.recognition.onresult = (event: any) => {
      interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      this.ngZone.run(() => {
        if (this.isListeningStyle) {
          this.brandStyle = finalTranscript + interimTranscript;
          if (event.results[event.results.length - 1].isFinal) {
            this.showToast('Style input recorded', 'success');
          }
        } else if (this.isListeningPrompt) {
          this.prompt = finalTranscript + interimTranscript;
          if (event.results[event.results.length - 1].isFinal) {
            this.showToast('Prompt recorded', 'success');
        }
        }
      });
    };

    // Reset transcripts when starting new recording
    this.recognition.onstart = () => {
      finalTranscript = '';
      interimTranscript = '';
      this.isListening = true;
      this.showToast('Listening... Click microphone again to stop', 'info');
      this.setupAudioMonitoring();
    };

    // Keep existing error handlers
    this.recognition.onerror = (event: any) => this.handleVoiceError(event);
    this.recognition.onend = () => {
      // Only restart if we're still supposed to be listening
      if (this.isListening) {
        try {
          this.recognition?.start();
        } catch (error) {
          console.error('Error restarting recognition:', error);
        }
      } else {
        this.handleVoiceEnd();
      }
    };

    // Keep other existing event handlers
    this.recognition.onnomatch = () => {
      this.showToast('Could not recognize what you said. Please try again.', 'warning');
    };

    this.recognition.onaudiostart = () => {
      console.log('Audio capturing started');
    };

    this.recognition.onaudioend = () => {
      console.log('Audio capturing ended');
    };

    this.recognition.onsoundstart = () => {
      console.log('Sound detected');
      this.audioDetected = true;
    };

    this.recognition.onsoundend = () => {
      console.log('Sound ended');
    };

    this.recognition.onspeechstart = () => {
      console.log('Speech started');
      this.audioDetected = true;
      this.showToast('Speech detected!', 'success');
    };

    this.recognition.onspeechend = () => {
      console.log('Speech ended');
      if (this.audioDetected) {
        this.showToast('Processing your speech...', 'info');
      }
    };
  }

  private handleUnsupportedBrowser() {
    this.isRecognitionSupported = false;
    console.warn("Speech Recognition is not supported by this browser.");
    this.showToast('Voice input is not supported in your browser. Please type your input instead.', 'warning');
  }

  private handleInitializationError(error: any) {
    this.isRecognitionSupported = false;
    console.error("Error initializing speech recognition:", error);
    this.showToast('Failed to initialize voice input. Please type your input instead.', 'error');
  }

  private handleVoiceResult(event: any) {
    clearTimeout(this.recognitionTimeout);
    try {
      const transcript = event.results[0][0].transcript.trim();
      const confidence = event.results[0][0].confidence;

      this.ngZone.run(() => {
        if (this.isListeningStyle) {
          // For style input, try to match with existing styles
          const matchedStyle = this.findMatchingStyle(transcript);
          if (matchedStyle) {
            this.brandStyle = matchedStyle;
            this.showToast(`Style set to: ${matchedStyle}`, 'success');
          } else {
            this.brandStyle = transcript;
            this.showToast('Style set, but might not match predefined styles', 'warning');
          }
          this.isListeningStyle = false;
        } else if (this.isListeningPrompt) {
          this.prompt = transcript;
          this.showToast('Prompt recorded successfully', 'success');
          this.isListeningPrompt = false;
        }

        if (confidence < 0.5) {
          this.showToast('Low confidence in voice recognition. Please try again.', 'warning');
        }
      });
    } catch (error) {
      console.error('Error processing voice result:', error);
      this.showToast('Error processing voice input', 'error');
    }
  }

  private handleVoiceError(event: any) {
    console.error("Speech recognition error:", event.error);
    clearTimeout(this.recognitionTimeout);

    this.ngZone.run(() => {
      this.isListeningStyle = false;
      this.isListeningPrompt = false;

      let errorMessage = 'Voice input error: ';
      switch (event.error) {
        case 'network':
          if (this.currentRetry < this.maxRetries) {
            this.currentRetry++;
            this.retryRecognition();
            return;
          }
          errorMessage += 'Network connection failed. Please check your internet connection.';
          break;
        case 'no-speech':
          errorMessage += 'No speech detected. Please try again.';
          break;
        case 'audio-capture':
          errorMessage += 'No microphone detected. Please check your microphone settings.';
          break;
        case 'not-allowed':
          errorMessage += 'Microphone access denied. Please allow microphone access in your browser settings.';
          break;
        case 'aborted':
          errorMessage += 'Voice input was aborted. Please try again.';
          break;
        case 'language-not-supported':
          errorMessage += 'Language not supported. Using English (US).';
          this.recognition.lang = 'en-US';
          break;
        default:
          errorMessage += 'An unexpected error occurred. Please try again.';
      }
      this.showToast(errorMessage, 'error');
    });
  }

  private retryRecognition() {
    setTimeout(() => {
      this.showToast(`Retrying voice input (Attempt ${this.currentRetry}/${this.maxRetries})...`, 'info');
      this.startVoiceInput('prompt');
    }, this.retryDelay);
  }

  private handleVoiceEnd() {
    clearTimeout(this.recognitionTimeout);
    this.ngZone.run(() => {
      if (!this.isListening) {
        this.isListeningStyle = false;
        this.isListeningPrompt = false;
        this.stopAudioMonitoring();
      }
    });
  }

  private findMatchingStyle(transcript: string): string | null {
    const normalizedInput = transcript.toLowerCase();
    for (const style of this.styles) {
      if (style.name.toLowerCase().includes(normalizedInput) ||
          normalizedInput.includes(style.name.toLowerCase())) {
        return style.name;
      }
    }
    return null;
  }

  get containerClass() {
    return `step-container step-${this.step}`;
  }

  nextStep() {
    if (this.step === 1 && this.brandName) {
      const validation = this.brandValidator.validateBrandName(this.brandName);
      if (!validation.isValid) {
        this.showToast(validation.message, 'warning');
        return;
      }
    }

    if (this.step < 4) {
      this.step++;
      this.saveCurrentState();
    }
  }

  previousStep() {
    if (this.step > 1) this.step--;
  }

  startPromptVoiceInput() {
    this.startVoiceInput('prompt');
  }

  private startVoiceInput(type: 'prompt') {
    if (!this.isRecognitionSupported) {
      this.showToast('Voice input is not supported in your browser', 'error');
      return;
    }

    if (!navigator.onLine) {
      this.showToast('No internet connection. Please check your network.', 'error');
      return;
    }

    // If already listening, stop the recognition
    if (this.isListening) {
      this.stopVoiceInput();
      return;
    }

    // Check if microphone permission is granted
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        try {
          if (this.recognition) {
            this.currentRetry = 0;
            this.audioDetected = false;
            this.isProcessing = true;

            this.isListeningPrompt = true;
            this.isListeningStyle = false;

            setTimeout(() => {
              this.isProcessing = false;
              this.recognition?.start();
            }, 500);
          }
        } catch (error) {
          console.error('Error starting voice input:', error);
          this.showToast('Error starting voice input. Please try again.', 'error');
          this.stopVoiceInput();
        }
      })
      .catch(error => {
        console.error('Microphone permission error:', error);
        this.showToast('Please allow microphone access to use voice input.', 'error');
      });
  }

  private stopVoiceInput() {
    this.isListening = false;
    this.isListeningStyle = false;
    this.isListeningPrompt = false;
    this.isProcessing = false;

    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }

    this.stopAudioMonitoring();
    this.showToast('Voice input stopped', 'info');
  }

  openStylePreview(event: Event, styleName: string) {
    event.stopPropagation();
    this.currentStyle = styleName;
    this.currentImages = this.styleImages[styleName] || [];
    this.modalOpen = true;
  }

  closeStyleModal() {
    this.modalOpen = false;
    this.currentStyle = '';
    this.currentImages = [];
  }

  restart() {
    this.step = 1;
    this.brandName = '';
    this.brandStyle = '';
    this.prompt = '';
    this.generatedImage = null;
    this.images = null;
    this.imageData = null;
  }

  addToFavorites(event: MouseEvent) {
    console.log("Add To Favorites");
    event.stopPropagation();

    if (this.generatedImage) {
      this.imagesService.postAddToFavorites(this.generatedImage).subscribe(response => {
        console.log(response);
      }, error => {
        console.error("Error Adding Image to Favorites:", error.error.error);
        this.showToast(error.error.error);
        this.isLoading = false;
      });
      console.log("Added To Favorites");
      this.showToast("Added To Favorites");
    } else {
      this.showToast("Image isn't Available");
    }
  }

  showToast(msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'error') {
    const backgroundColor = {
      success: '#28a745',
      error: '#dc3545',
      warning: '#ffc107',
      info: '#17a2b8'
    }[type];

    Toastify({
      text: msg,
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor,
      stopOnFocus: true
    }).showToast();
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  downloadImage(event: Event) {
    event.stopPropagation();

    if (this.generatedImage?.image) {
      this.convertToBlob(this.generatedImage.image).then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'generated-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }).catch(error => {
        console.error("Error downloading image:", error);
      });
    }
  }

  private convertToBlob(imageUrl: string): Promise<Blob> {
    return fetch(imageUrl, { mode: 'cors' }).then(response => response.blob());
  }

  editInImg2Img(imageUrl: string | null) {
    if (imageUrl && this.generatedImage) {
      this.router.navigate(['/img2img'], {
        state: {
          image: imageUrl,
          prompt: this.generatedImage.prompt
        }
      });
    } else {
      this.showToast('No image available to edit');
    }
  }

  handleVoiceInput(value: string) {
    if (this.isListeningPrompt) {
      this.prompt = value;
    }
  }

  onInputChange() {
    // This method is called when input values change
    // You can add validation or other logic here if needed
  }

  onBackgroundRemoved(processedImageUrl: string) {
    if (this.generatedImage) {
      this.generatedImage = {
        ...this.generatedImage,
        image: processedImageUrl
      };
    } else {
      this.showToast("Image isn't Available");
    }
  }

  goToBackgroundRemoval(event: Event) {
    event.stopPropagation();
    if (this.generatedImage?.image) {
      this.router.navigate(['/background-removal'], {
        state: { image: this.generatedImage.image }
      });
    } else {
      this.showToast("Image isn't Available");
    }
  }

  findSimilarLogos(event: Event) {
    event.stopPropagation();
    if (this.generatedImage?.image) {
      // Convert base64 string to data URL if needed
      let imageUrl = this.generatedImage.image;
      if (!imageUrl.startsWith('data:')) {
        imageUrl = 'data:image/png;base64,' + imageUrl;
      }

      // Navigate to logo similarity with the image data
      this.router.navigate(['/logo-similarity'], {
        queryParams: {
          imageUrl: imageUrl
        }
      });
    }
  }

  handleImageGenerated(response: any) {
    this.generatedImage = response;
    this.isLoading = false;
    this.error = null;
    // Save the generated image to localStorage
    localStorage.setItem('lastGeneratedImage', JSON.stringify(response));
  }

  toggleLanguage() {
    this.currentLanguage = this.currentLanguage === 'en' ? 'ar' : 'en';
    this.textDirection = this.currentLanguage === 'en' ? 'ltr' : 'rtl';

    // Update recognition language
    if (this.recognition) {
      this.recognition.lang = this.currentLanguage === 'en' ? 'en-US' : 'ar-SA';
    }

    // Stop any ongoing recognition
    if (this.isListening) {
      this.stopVoiceInput();
    }

    // Show feedback to user
    this.showToast(`Switched to ${this.currentLanguage === 'en' ? 'English' : 'Arabic'} input`, 'info');
  }
}

