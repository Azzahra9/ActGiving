<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $token;
    public string $email;
    public string $resetUrl;

    /**
     * Create a new message instance.
     */
    public function __construct(string $token, string $email, string $resetUrl)
    {
        $this->token = $token;
        $this->email = $email;
        $this->resetUrl = $resetUrl;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Permintaan Reset Kata Sandi - ActGiving',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.reset_password',
            with: [
                'token' => $this->token,
                'email' => $this->email,
                'resetUrl' => $this->resetUrl,
            ],
        );
    }
}
