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
     * Tambah Kategori
     *
     * Buat kategori baru jika belum ada, atau kembalikan kategori yang sudah ada.
     *
     * @unauthenticated
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_name' => 'required|string|max:100',
        ], [
            'category_name.required' => 'Nama kategori wajib diisi.',
            'category_name.string' => 'Nama kategori harus berupa teks.',
            'category_name.max' => 'Nama kategori maksimal 100 karakter.',
        ]);

        $categoryName = trim($validated['category_name']);

        // Cari kategori yang sudah ada tanpa memedulikan huruf besar/kecil (case-insensitive)
        $category = Category::whereRaw('LOWER(category_name) = ?', [strtolower($categoryName)])->first();

        if (! $category) {
            $category = Category::create([
                'category_name' => $categoryName,
            ]);
            $statusCode = 201;
            $message = 'Kategori baru berhasil dibuat';
        } else {
            $statusCode = 200;
            $message = 'Kategori sudah tersedia';
        }

        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $category,
        ], $statusCode);
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
