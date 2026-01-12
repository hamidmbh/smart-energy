<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'room_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function assignedRoom()
    {
        return $this->belongsTo(Room::class, 'room_id');
    }

    public function technicianInterventions()
    {
        return $this->hasMany(Intervention::class, 'technician_id');
    }

    public function assignedRooms()
    {
        return $this->belongsToMany(Room::class, 'technician_room', 'technician_id', 'room_id')
            ->withTimestamps();
    }

    public function technicianFloors()
    {
        return $this->hasMany(TechnicianFloor::class, 'technician_id');
    }

    public function getAssignedFloorNumbersAttribute()
    {
        return $this->technicianFloors()->pluck('floor')->toArray();
    }
}
