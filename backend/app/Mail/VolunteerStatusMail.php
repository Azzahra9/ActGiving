<?php

namespace App\Mail;

use App\Models\VolunteerRegistration;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VolunteerStatusMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public VolunteerRegistration $registration;

    /**
     * Create a new message instance.
     */
    public function __construct(VolunteerRegistration $registration)
    {
        $this->registration = $registration->loadMissing(['campaign', 'user']);
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $statusText = $this->registration->status === 'accepted' ? 'Diterima' : 'Belum Lolos';

        return new Envelope(
            subject: "Update Status Pendaftaran Relawan: {$statusText} - ActGiving",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.volunteer_status',
            with: [
                'registration' => $this->registration,
                'campaign' => $this->registration->campaign,
                'volunteer' => $this->registration->user,
                'status' => $this->registration->status,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
