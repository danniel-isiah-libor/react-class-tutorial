<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    use HasFactory;

    protected $with = [
        'user'
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'title',
        'ingredients',
        'instructions'
    ];

    /**
     * Return User relationship.
     * 
     * @return App\Models\User
     */
    public function user()
    {
        return $this->setConnection('sanctum_mysql')->belongsTo(User::class);
    }
}
