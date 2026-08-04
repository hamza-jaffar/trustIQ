<?php

use App\Models\User;

it('blocks access to the users index without the users.view permission', function () {
    $user = User::factory()->create();

    $this->actingAs($user);

    $response = $this->get('/users');

    $response->assertForbidden();
});

it('blocks access to the roles index without the roles.view permission', function () {
    $user = User::factory()->create();

    $this->actingAs($user);

    $response = $this->get('/roles');

    $response->assertForbidden();
});
