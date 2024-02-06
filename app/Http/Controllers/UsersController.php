<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Http\Resources\FullUserResource;
use App\Http\Resources\UserCollection;
use App\Http\Resources\UserResource;
use App\Models\User;
use Carbon\Carbon;
use Gate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Log;
use Symfony\Component\HttpFoundation\Response;

class UsersController extends Controller
{
    public function getAll(Request $request): Response
    {
        return response(new UserCollection(User::paginate(5)));
    }

    public function get(Request $request, User $user): Response
    {
        return response(['user' => new FullUserResource($user)]);
    }

    public function update(UserRequest $request, User $user): Response
    {
        $path = 'public/images/avatars/users/';

        if ($request->user()->isNot($user) && !Gate::allows('isAdmin')) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        $data = $request->validated();

        if (!Gate::allows('isAdmin')) {
            if (!empty($data['password']) && !Hash::check($data['password'], $user->password)) {
                return response('', Response::HTTP_UNAUTHORIZED);
            }
        }

        if (!empty($request->file('avatar')) && $request->file('avatar')->isValid()) {
            if ($user->avatar) {
                Storage::delete($path . $user->avatar);
            }

            $file = $request->file('avatar');
            $fileName = (new Carbon())->format('Ymd_his') . '_' . $user->uid . '.' . $file->getClientOriginalExtension();

            $file->storeAs($path, $fileName);

            $user->avatar = $path . $fileName;
        }

        $user->name = !empty($data['name']) ? $data['name'] : $user->name;
        $user->uid = !empty($data['uid']) ? $data['uid'] : $user->uid;
        $user->email = !empty($data['email']) ? $data['email'] : $user->email;
        $user->phone = !empty($data['phone']) ? $data['phone'] : $user->phone;

        if (!empty($data['new_password'])) {
            $user->password = $data['new_password'];
        }

        if ($user->isDirty('password') && $request->user()->isNot($user)) {
            $user->tokens()->delete();
        }

        $user->save();

        return response(['user' => new FullUserResource($user)]);
    }

    public function delete(Request $request, User $user): Response
    {
        if ($request->user()->isNot($user) && !Gate::allows('isAdmin')) {
            return response('', Response::HTTP_FORBIDDEN);
        }

        $user->tokens()->delete();

        $cookie = cookie()->forget('token');

        $user->delete();

        if ($request->user()->is($user)) {
            return response()->withCookie($cookie);
        }

        return response();
    }
}
