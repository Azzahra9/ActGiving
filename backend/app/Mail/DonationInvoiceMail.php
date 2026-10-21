<?php

namespace App\Mail;

use App\Models\Donation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DonationInvoiceMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public Donation $donation;

    /**
     * Create a new message instance.
     */
    public function __construct(Donation $donation)
    {
        // Muat relasi campaign jika belum dimuat
        $this->donation = $donation->relationLoaded('campaign')
            ? $donation
            : $donation->load('campaign');
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Bukti Pembayaran Donasi - ActGiving ['.$this->donation->reference_code.']',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.donation_invoice',
            with: [
                'donation' => $this->donation,
                'campaign' => $this->donation->campaign,
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
