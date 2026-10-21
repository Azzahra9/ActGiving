<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @group Kategori
 *
 * Manajemen kategori program kampanye.
 */
class CategoryController extends Controller
{
    /**
     * Daftar Kategori
     *
     * Tampilkan semua kategori (Publik).
     *
     * @unauthenticated
     */
    public function index(): JsonResponse
    {
        $categories = Category::withCount('campaigns')->get();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    /**
     * Tambah Kategori (Admin)
     *
     * Buat kategori baru (Admin).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_name' => 'required|string|max:100|unique:categories,category_name',
        ]);

        $category = Category::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Kategori berhasil dibuat',
            'data' => $category,
        ], 201);
    }

    /**
     * Update Kategori (Admin)
     *
     * Perbarui kategori (Admin).
     */
    public function update(Request $request, $id): JsonResponse
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'category_name' => 'required|string|max:100|unique:categories,category_name,'.$category->id,
        ]);

        $category->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Kategori berhasil diperbarui',
            'data' => $category,
        ]);
    }

    /**
     * Hapus Kategori (Admin)
     *
     * Hapus kategori (Admin).
     */
    public function destroy($id): JsonResponse
    {
        $category = Category::findOrFail($id);

        if ($category->campaigns()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Kategori tidak dapat dihapus karena masih digunakan oleh kampanye yang ada.',
            ], 422);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Kategori berhasil dihapus',
        ]);
    }
}
