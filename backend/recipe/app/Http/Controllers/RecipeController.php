<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use Illuminate\Http\Request;

class RecipeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Recipe::orderBy('updated_at', 'desc')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => ['required', 'string'],
            'ingredients' => ['required', 'string'],
            'instructions' => ['required', 'string']
        ]);

        $recipe = Recipe::create([
            'user_id' => $request->user()->id,
            'title' => $request->title,
            'ingredients' => $request->ingredients,
            'instructions' => $request->instructions
        ]);

        return response()->json($recipe);
    }

    /**
     * Display the specified resource.
     */
    public function show(Recipe $recipe)
    {
        return response()->json($recipe);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Recipe $recipe)
    {
        if ($request->user()->cannot('update', $recipe)) abort(403);

        $request->validate([
            'title' => ['required', 'string'],
            'ingredients' => ['required', 'string'],
            'instructions' => ['required', 'string']
        ]);

        $recipe->update([
            'user_id' => $request->user()->id,
            'title' => $request->title,
            'ingredients' => $request->ingredients,
            'instructions' => $request->instructions
        ]);

        return response()->json($recipe);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Recipe $recipe)
    {
        if ($request->user()->cannot('delete', $recipe)) abort(403);

        return response()->json($recipe->delete());
    }
}
